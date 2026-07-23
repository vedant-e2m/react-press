import Link from "next/link";
import { notFound } from "next/navigation";
import { getCms } from "@/lib/cms";
import { formatDate } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = getCms();
  let siteName = "NextPress";

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      siteName = settings.siteName || siteName;
    }
  } catch {
    // defaults
  }

  if (!cms.getPostBySlug) {
    notFound();
  }

  const post = await cms.getPostBySlug(slug, { status: "published" });
  if (!post) {
    notFound();
  }

  return (
    <div className="blog-shell">
      <nav className="blog-nav">
        <Link href="/" className="brand">
          {siteName}
        </Link>
        <Link href="/blog" className="back">
          ← Blog
        </Link>
      </nav>

      <main id="main-content" className="blog-main">
        <article>
          <header className="blog-header">
            <h1>{post.title}</h1>
            <p className="blog-post-meta">
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.updatedAt)}
            </p>
            {post.featuredImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.featuredImageUrl}
                alt=""
                className="blog-post-thumb"
                style={{ marginTop: 24 }}
              />
            ) : null}
          </header>
          {post.content ? (
            <div
              className="prose prose-zinc mt-2 max-w-none"
              style={{ color: "var(--np-fg)" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : null}
        </article>
      </main>
    </div>
  );
}

export const revalidate = 3600;
