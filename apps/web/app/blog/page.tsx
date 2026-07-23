import Link from "next/link";
import { getCms } from "@/lib/cms";
import { formatDate } from "@/lib/utils";

export default async function BlogIndexPage() {
  const cms = getCms();
  let posts: Awaited<ReturnType<NonNullable<ReturnType<typeof getCms>["listPosts"]>>> = [];
  let siteName = "NextPress";

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      siteName = settings.siteName || siteName;
    }
  } catch {
    // defaults
  }

  try {
    if (cms.listPosts) {
      const all = await cms.listPosts();
      posts = all.filter((p) => p.status === "published");
    }
  } catch {
    posts = [];
  }

  return (
    <div className="blog-shell">
      <nav className="blog-nav">
        <Link href="/" className="brand">
          {siteName}
        </Link>
        <Link href="/" className="back">
          ← Home
        </Link>
      </nav>

      <main id="main-content" className="blog-main">
        <header className="blog-header">
          <h1>Blog</h1>
          <p>Latest posts and updates from the NextPress team.</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--np-muted)" }}>
            No published posts yet.
          </p>
        ) : (
          <ul className="blog-post-list">
            {posts.map((post) => (
              <li key={post.id} className="blog-post-item">
                {post.featuredImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featuredImageUrl}
                    alt=""
                    className="blog-post-thumb"
                  />
                ) : null}
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.excerpt ? <p className="blog-post-excerpt">{post.excerpt}</p> : null}
                <p className="blog-post-meta">
                  {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
