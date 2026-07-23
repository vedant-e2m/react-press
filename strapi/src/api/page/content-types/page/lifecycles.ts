type StrapiLike = {
  log: {
    warn: (message: string, error?: unknown) => void;
  };
};

/**
 * Asks the Next.js public site to revalidate a path after page changes.
 */
export async function notifyWebRevalidate(slug: string | undefined, strapi: StrapiLike) {
  const baseUrl = process.env.WEB_REVALIDATE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATION_SECRET ?? process.env.REVALIDATE_SECRET;

  if (!baseUrl || !secret) {
    return;
  }

  const path = slug ? `/${slug}` : "/";

  try {
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, path }),
    });
    if (!response.ok) {
      strapi.log.warn(`Web revalidate failed (${response.status}) for ${path}`);
    }
  } catch (error) {
    strapi.log.warn("Web revalidate request failed", error);
  }
}

function getStrapi(): StrapiLike {
  const candidate = (globalThis as { strapi?: StrapiLike }).strapi;
  if (candidate?.log?.warn) {
    return candidate;
  }
  return { log: { warn: (message, error) => console.warn(message, error) } };
}

export default {
  async afterCreate(event: { result?: { slug?: string } }) {
    await notifyWebRevalidate(event.result?.slug, getStrapi());
  },

  async afterUpdate(event: { result?: { slug?: string } }) {
    await notifyWebRevalidate(event.result?.slug, getStrapi());
  },
};
