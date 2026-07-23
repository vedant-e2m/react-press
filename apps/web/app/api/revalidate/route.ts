import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * ISR revalidation webhook for Strapi → Next.js public site.
 * Requires REVALIDATION_SECRET (or legacy REVALIDATE_SECRET).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET ?? process.env.REVALIDATE_SECRET;
  const body = (await request.json().catch(() => ({}))) as {
    secret?: string;
    path?: string;
  };

  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATION_SECRET is not configured" },
      { status: 503 },
    );
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const path = body.path ?? "/";
  revalidatePath(path);
  if (path !== "/") {
    revalidatePath("/");
  }
  revalidatePath("/blog");

  return NextResponse.json({ revalidated: true, path });
}
