import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="blog-shell"
      style={{
        display: "flex",
        minHeight: "60vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <p
        className="font-mono text-xs tabular-nums"
        style={{ color: "var(--np-accent)", margin: 0 }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--np-font-display)",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginTop: 8,
          marginBottom: 0,
        }}
      >
        Page not found
      </h1>
      <p className="mt-2 max-w-[36ch] text-sm" style={{ color: "var(--np-muted)" }}>
        This URL does not match a published page or post.
      </p>
      <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[10px] bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-[10px] border border-zinc-200 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
        >
          Blog
        </Link>
      </div>
    </main>
  );
}
