import { revalidatePath } from "next/cache";

/** Invalidate public routes after content changes. */
export function revalidatePublishedContent(slug?: string) {
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/${slug}`);
    revalidatePath(`/preview/${slug}`);
  }
  revalidatePath("/blog");
}
