import { useEffect, useState } from "react";
import { strapi } from "@/lib/strapi";

interface Page {
  documentId: string;
  title: string;
  slug: string;
}

export function Home() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    strapi
      .find<Page>("pages", { "pagination[pageSize]": "1" })
      .then(() => setStatus("ok"))
      .catch((err: Error) => {
        setStatus("error");
        setError(err.message);
      });
  }, []);

  return (
    <div className="page">
      <header className="header">
        <span className="brand">NextPress</span>
        <span className="badge">React + Vite</span>
      </header>

      <main className="main">
        <p className="eyebrow">Phase 0 — Foundation</p>
        <h1>WordPress ease. React performance.</h1>
        <p className="lead">
          This is the optional React SPA frontend. It shares the same Strapi
          backend and native page documents as the Next.js app.
        </p>

        <div className="card">
          <h2>Strapi connection</h2>
          {status === "loading" && <p>Checking connection…</p>}
          {status === "ok" && <p className="ok">Connected to Strapi API</p>}
          {status === "error" && (
            <p className="warn">
              Strapi not reachable: {error}. Start services with{" "}
              <code>docker compose up</code>
            </p>
          )}
        </div>

        <p className="note">
          Admin lives in Strapi at{" "}
          <a href="http://localhost:1338/admin">localhost:1338/admin</a>
          {" · "}
          <a href="/showcase">View component showcase</a>
          {" · "}
          <a href="/public-market">View Public Market clone</a>
        </p>
      </main>
    </div>
  );
}
