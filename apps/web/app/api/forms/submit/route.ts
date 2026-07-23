import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const SUBMISSIONS_DIR = path.join(process.cwd(), ".data", "form-submissions");

type SubmitBody = {
  formId?: string;
  fields?: Record<string, string>;
};

/** Accepts contact form submissions and stores them as JSON files. */
export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const formId = body.formId?.trim();
  const fields = body.fields;

  if (!formId || !fields || typeof fields !== "object") {
    return NextResponse.json({ error: "formId and fields are required" }, { status: 400 });
  }

  const sanitizedFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string") continue;
    sanitizedFields[key.slice(0, 64)] = value.slice(0, 5000);
  }

  if (Object.keys(sanitizedFields).length === 0) {
    return NextResponse.json({ error: "No valid field values" }, { status: 400 });
  }

  const submission = {
    formId,
    fields: sanitizedFields,
    submittedAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
    const filename = `${formId}-${Date.now()}.json`;
    await fs.writeFile(path.join(SUBMISSIONS_DIR, filename), JSON.stringify(submission, null, 2), "utf8");
  } catch {
    return NextResponse.json({ error: "Failed to store submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
