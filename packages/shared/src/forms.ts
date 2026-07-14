export type ContactFormFieldType = "text" | "email" | "tel" | "textarea" | "select";

export type ContactFormField = {
  name: string;
  label: string;
  type: ContactFormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[] | string;
};

export type ContactFormSubmission = {
  formId: string;
  fields: Record<string, string>;
  submittedAt: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates contact form field values against field definitions. */
export function validateContactForm(
  fields: ContactFormField[],
  values: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = (values[field.name] ?? "").trim();
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }
    if (field.type === "email" && value && !EMAIL_RE.test(value)) {
      errors[field.name] = "Enter a valid email address";
    }
  }

  return errors;
}
