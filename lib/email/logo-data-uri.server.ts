import { readFileSync } from "node:fs";
import path from "node:path";
import { EMAIL_BRAND } from "@/lib/email/brand";

let cachedDataUri: string | null = null;

/** Inline PNG for outbound emails (Gmail blocks remote logo URL on production). */
export function getEmailLogoDataUri(): string {
  if (cachedDataUri) {
    return cachedDataUri;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    EMAIL_BRAND.logoPath.replace(/^\//, ""),
  );
  const buffer = readFileSync(filePath);
  cachedDataUri = `data:image/png;base64,${buffer.toString("base64")}`;
  return cachedDataUri;
}

/** Replaces the branded header logo URL with an inline data URI in outbound HTML. */
export function embedInlineEmailLogo(html: string): string {
  const dataUri = getEmailLogoDataUri();
  return html.replace(/(<img class="email-logo" src=")[^"]*(")/, `$1${dataUri}$2`);
}
