export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
  };
}

export type StrapiClientError = Error & { status: number; name: "StrapiClientError" };

let strapiUrl = "http://localhost:1337";

export function configureStrapiClient(options: { url: string }) {
  strapiUrl = options.url;
}

export function getStrapiUrl() {
  return strapiUrl;
}

function createStrapiError(message: string, status: number): StrapiClientError {
  const error = new Error(message) as StrapiClientError;
  error.name = "StrapiClientError";
  error.status = status;
  return error;
}

export async function strapiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${strapiUrl}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as StrapiErrorResponse | null;
    throw createStrapiError(
      body?.error?.message ?? `Strapi error: ${res.status}`,
      res.status,
    );
  }

  const json = (await res.json()) as StrapiResponse<T>;
  return json.data;
}

export const strapi = {
  find: <T>(collection: string, params?: Record<string, string>, token?: string) =>
    strapiFetch<T[]>(`/${collection}?${new URLSearchParams(params ?? {})}`, {}, token),

  findOne: <T>(
    collection: string,
    id: string,
    params?: Record<string, string>,
    token?: string,
  ) =>
    strapiFetch<T>(`/${collection}/${id}?${new URLSearchParams(params ?? {})}`, {}, token),

  create: <T>(collection: string, data: unknown, token: string) =>
    strapiFetch<T>(`/${collection}`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  update: <T>(collection: string, id: string, data: unknown, token: string) =>
    strapiFetch<T>(`/${collection}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  delete: (collection: string, id: string, token: string) =>
    strapiFetch<unknown>(`/${collection}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export async function strapiLogin(identifier: string, password: string) {
  const res = await fetch(`${strapiUrl}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw createStrapiError("Invalid credentials", res.status);
  }

  return res.json() as Promise<{
    jwt: string;
    user: { id: number; username: string; email: string };
  }>;
}

export interface StrapiUploadFile {
  id: number;
  documentId: string;
  name: string;
  url: string;
  mime: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  alternativeText?: string | null;
  caption?: string | null;
  formats?: Record<
    string,
    { url: string; width?: number; height?: number; size?: number }
  > | null;
  createdAt: string;
}

/** Upload a file to Strapi media library. */
export async function strapiUpload(
  file: Blob,
  filename: string,
  token: string,
): Promise<StrapiUploadFile[]> {
  const formData = new FormData();
  formData.append("files", file, filename);

  const res = await fetch(`${strapiUrl}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as StrapiErrorResponse | null;
    throw createStrapiError(
      body?.error?.message ?? `Upload failed: ${res.status}`,
      res.status,
    );
  }

  return res.json() as Promise<StrapiUploadFile[]>;
}

/** List files from Strapi media library. */
export async function strapiListMedia(
  params: Record<string, string> = {},
  token?: string,
): Promise<StrapiUploadFile[]> {
  const query = new URLSearchParams({
    sort: "createdAt:desc",
    "pagination[pageSize]": "100",
    ...params,
  });

  const res = await fetch(`${strapiUrl}/api/upload/files?${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw createStrapiError(`Failed to list media: ${res.status}`, res.status);
  }

  const json = (await res.json()) as StrapiUploadFile[] | StrapiResponse<StrapiUploadFile[]>;
  return Array.isArray(json) ? json : json.data;
}

/** Update media metadata in Strapi. */
export async function strapiUpdateMedia(
  id: string,
  data: { alternativeText?: string; caption?: string },
  token: string,
): Promise<StrapiUploadFile> {
  const res = await fetch(`${strapiUrl}/api/upload?id=${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileInfo: data }),
  });

  if (!res.ok) {
    throw createStrapiError(`Failed to update media: ${res.status}`, res.status);
  }

  const json = (await res.json()) as StrapiUploadFile[] | StrapiUploadFile;
  return Array.isArray(json) ? json[0] : json;
}

/** Delete a file from Strapi media library. */
export async function strapiDeleteMedia(id: string, token: string): Promise<void> {
  const res = await fetch(`${strapiUrl}/api/upload/files/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw createStrapiError(`Failed to delete media: ${res.status}`, res.status);
  }
}
