"use client";

import { useId, useState } from "react";
import type { ContactFormField } from "@nextpress/shared";
import { validateContactForm } from "@nextpress/shared";
import { type LayoutProps, layoutStyle, maxWidthClass } from "../layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ContactFormBlockProps = {
  formId: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  fields: ContactFormField[];
  columns?: "1" | "2" | "3";
  variant?: "inline" | "card" | "newsletter-overlay";
  backgroundColor?: string;
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
} & LayoutProps;

/**
 * Gravity Forms–style contact form block with column layout and accessible fields.
 */
export function ContactFormBlock({
  formId,
  title,
  description,
  submitLabel = "Submit",
  successMessage = "Thank you — your message has been sent.",
  fields,
  columns = "1",
  variant = "inline",
  backgroundColor,
  backgroundImage,
  overlayColor = "rgba(0,0,0,0.5)",
  overlayOpacity = 0,
  textColor,
  buttonColor,
  buttonTextColor,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  offsetX,
  offsetY,
  maxWidth,
  className,
  blockId,
}: ContactFormBlockProps) {
  const formFields = (fields?.filter((f) => f.name && f.label) ?? []).map((field) => {
    const rawOptions = field.options;
    const options =
      typeof rawOptions === "string"
        ? rawOptions.split(",").map((o: string) => o.trim()).filter(Boolean)
        : rawOptions;
    return { ...field, options };
  });
  const errorId = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const gridClass =
    columns === "3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : columns === "2"
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactForm(formFields, values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, fields: values }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }
      setStatus("success");
      setValues({});
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  const overlayAlpha = Math.min(90, Math.max(0, overlayOpacity)) / 100;

  const sectionStyle = {
    backgroundColor: backgroundColor || undefined,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: backgroundImage ? "cover" as const : undefined,
    backgroundPosition: backgroundImage ? "center" as const : undefined,
    color: textColor || undefined,
    ...layoutStyle({
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      offsetX,
      offsetY,
    }),
  };

  if (status === "success") {
    return (
      <section
        id={blockId || undefined}
        className={cn("relative px-6 py-16", className)}
        style={sectionStyle}
        role="status"
        aria-live="polite"
      >
        {backgroundImage && overlayAlpha > 0 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: overlayAlpha }}
            aria-hidden
          />
        ) : null}
        <div className={cn("relative z-10 mx-auto text-center", maxWidthClass(maxWidth ?? "2xl"))}>
          <p className="text-lg font-medium">{successMessage}</p>
        </div>
      </section>
    );
  }

  const formInner = (
    <>
      {title && (
        <h2
          id={`${formId}-title`}
          className={cn(
            "tracking-tight",
            variant === "newsletter-overlay"
              ? "text-center text-lg font-normal leading-snug"
              : "text-2xl font-semibold",
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className={cn("mt-2 text-sm opacity-80", variant === "newsletter-overlay" && "text-center")}>
          {description}
        </p>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        className={cn(
          "grid gap-5",
          variant === "newsletter-overlay" ? "mt-6" : "mt-8",
          gridClass,
        )}
        aria-describedby={serverError ? errorId : undefined}
      >
        {formFields.map((field) => {
          const fieldId = `${formId}-${field.name}`;
          const hasError = Boolean(errors[field.name]);
          const commonProps = {
            id: fieldId,
            name: field.name,
            required: field.required,
            "aria-required": field.required || undefined,
            "aria-invalid": hasError || undefined,
            "aria-describedby": hasError ? `${fieldId}-error` : undefined,
            className: cn(
              "w-full text-sm text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
              variant === "newsletter-overlay"
                ? "border-0 border-b border-zinc-400 bg-transparent px-0 py-2 text-center placeholder:text-zinc-400"
                : "rounded-lg border border-zinc-300 bg-white px-3 py-2",
              hasError ? "border-red-500" : "",
            ),
            value: values[field.name] ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              setValues((prev) => ({ ...prev, [field.name]: e.target.value })),
          };

          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-full" : undefined}>
              {variant !== "newsletter-overlay" ? (
                <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-600" aria-hidden="true"> *</span>}
                </label>
              ) : null}
              {field.type === "textarea" ? (
                <textarea {...commonProps} rows={4} placeholder={field.placeholder || field.label} />
              ) : field.type === "select" ? (
                <select {...commonProps}>
                  <option value="">Select…</option>
                  {(field.options ?? []).map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...commonProps}
                  type={field.type}
                  placeholder={field.placeholder || field.label}
                  autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "name"}
                />
              )}
              {hasError && (
                <p id={`${fieldId}-error`} className="mt-1 text-xs text-red-600" role="alert">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}

        <div className={cn(columns !== "1" && "sm:col-span-full", variant === "newsletter-overlay" && "text-center")}>
          {serverError && (
            <p id={errorId} className="mb-3 text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-60",
              variant === "newsletter-overlay"
                ? "mt-4 rounded-sm px-8 py-2.5 uppercase tracking-wide"
                : "rounded-lg px-6 py-3",
            )}
            style={{
              backgroundColor: buttonColor || "#18181B",
              color: buttonTextColor || "#FFFFFF",
            }}
          >
            {status === "submitting" ? "Sending…" : submitLabel}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <section
      id={blockId || undefined}
      className={cn("relative px-6 py-16", className)}
      style={sectionStyle}
      aria-labelledby={title ? `${formId}-title` : undefined}
    >
      {backgroundImage && overlayAlpha > 0 ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayAlpha }}
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-[420px] items-center justify-center p-8",
          variant === "newsletter-overlay"
            ? "max-w-none"
            : maxWidthClass(maxWidth ?? "3xl"),
          variant === "card" && "rounded-xl border border-zinc-200 bg-white/95 shadow-sm backdrop-blur-sm",
          variant === "newsletter-overlay" &&
            "max-w-md rounded-none bg-white px-10 py-12 text-zinc-900 shadow-xl",
        )}
      >
        {formInner}
      </div>
    </section>
  );
}
