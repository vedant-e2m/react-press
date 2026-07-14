"use client";

type FooterNewsletterProps = {
  formId: string;
  title: string;
  description?: string;
  submitLabel?: string;
};

export function FooterNewsletter({
  formId,
  title,
  description,
  submitLabel = "Subscribe",
}: FooterNewsletterProps) {
  return (
    <div className="w-full max-w-md bg-white p-8 shadow-lg">
      <h3 className="text-center text-lg font-medium text-zinc-700">{title}</h3>
      {description ? (
        <p className="mt-2 text-center text-sm text-zinc-600">{description}</p>
      ) : null}
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await fetch("/api/forms/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              formId,
              fields: { email: String(fd.get("email") ?? "") },
            }),
          });
          e.currentTarget.reset();
        }}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="email@email.com"
          className="w-full border-0 border-b border-zinc-400 bg-transparent px-0 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <button
          type="submit"
          className="w-full bg-[var(--theme-color-accent,#6FA84C)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
