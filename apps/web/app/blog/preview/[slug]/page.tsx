import { notFound } from "next/navigation";
import { getCms } from "@/lib/cms";
import { formatDate } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

/** Preview any post (draft or published) — same idea as /preview/[slug] for pages. */
export default async function BlogPostPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = getCms();

  if (!cms.getPostBySlug) {
    notFound();
  }

  const post = await cms.getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
        Preview mode — {post.status === "draft" ? "this post is a draft" : "published post"}
        {" · "}
        <a
          href={`${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338"}/admin`}
          className="font-medium underline"
        >
          Back to admin
        </a>
      </div>
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article>
          <header>
            <h1 className="font-theme-heading text-3xl font-normal tracking-tight text-foreground">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.updatedAt)}
            </p>
            {post.featuredImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.featuredImageUrl}
                alt=""
                className="mt-6 aspect-video w-full rounded-xl object-cover"
              />
            )}
          </header>
          {post.content && (
            <div
              className="prose prose-zinc mt-8 max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>
      </main>
    </>
  );
}
