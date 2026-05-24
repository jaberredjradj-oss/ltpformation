import { EMAIL_BRAND, getEmailLogoUrl } from "@/lib/email/brand";

export interface BrandedEmailOptions {
  /** Override base URL for logo (e.g. window.location.origin in admin preview). */
  logoBaseUrl?: string;
}

export interface BrandedEmailOutput {
  html: string;
  text: string;
}

const EMAIL_LOGO_MAX_WIDTH = 280;

function buildHtmlHead(title: string): string {
  return `<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <meta name="supported-color-schemes" content="light"/>
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width: 480px) {
      .email-logo {
        width: 88% !important;
        max-width: ${EMAIL_LOGO_MAX_WIDTH}px !important;
        height: auto !important;
      }
    }
  </style>
</head>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainTextToHtmlParagraphs(body: string): string {
  const blocks = body.trim().split(/\n\n+/);

  return blocks
    .map((block) => {
      const lines = block.split("\n").map((line) => escapeHtml(line));
      return `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#1a2744;">${lines.join("<br/>")}</p>`;
    })
    .join("");
}

function buildTextFooter(): string {
  return [
    "",
    "—",
    EMAIL_BRAND.name,
    EMAIL_BRAND.addressLine1,
    EMAIL_BRAND.addressLine2,
    `SIRET : ${EMAIL_BRAND.siret}`,
    `Déclaration d'activité : ${EMAIL_BRAND.activityDeclaration}`,
    `Email : ${EMAIL_BRAND.email}`,
    "",
    EMAIL_BRAND.disclaimer,
  ].join("\n");
}

function buildHtmlFooter(): string {
  return `
    <tr>
      <td style="padding:24px 32px 28px;border-top:1px solid #e8ecf2;background:#f8f9fb;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#0b1f3a;">${escapeHtml(EMAIL_BRAND.name)}</p>
        <p style="margin:0 0 4px;font-size:12px;line-height:1.55;color:#5c6578;">${escapeHtml(EMAIL_BRAND.addressLine1)}<br/>${escapeHtml(EMAIL_BRAND.addressLine2)}</p>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#5c6578;">
          SIRET : ${escapeHtml(EMAIL_BRAND.siret)}<br/>
          Déclaration d'activité : ${escapeHtml(EMAIL_BRAND.activityDeclaration)}<br/>
          Email : <a href="mailto:${escapeHtml(EMAIL_BRAND.email)}" style="color:#1d5eb0;text-decoration:none;">${escapeHtml(EMAIL_BRAND.email)}</a>
        </p>
        <p style="margin:16px 0 0;font-size:11px;line-height:1.5;color:#8a93a3;font-style:italic;">${escapeHtml(EMAIL_BRAND.disclaimer)}</p>
      </td>
    </tr>`;
}

/**
 * Wraps plain-text message body in the official LT Protect Formation email layout.
 * Message wording is unchanged — only presentation is added.
 */
export function buildBrandedEmail(body: string, options?: BrandedEmailOptions): BrandedEmailOutput {
  const trimmedBody = body.trim();
  const logoUrl = getEmailLogoUrl(options?.logoBaseUrl);
  const websiteLabel = EMAIL_BRAND.websiteUrl.replace(/^https?:\/\//, "");

  const html = `<!DOCTYPE html>
<html lang="fr">
${buildHtmlHead(EMAIL_BRAND.name)}
<body style="margin:0;padding:0;background:#eef1f6;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e3e8ef;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#0b1f3a 0%,#c9a227 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 22px;text-align:center;border-bottom:1px solid #eef1f6;">
              <img class="email-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(EMAIL_BRAND.name)}" width="${EMAIL_LOGO_MAX_WIDTH}" style="display:block;margin:0 auto 20px;max-width:${EMAIL_LOGO_MAX_WIDTH}px;width:100%;height:auto;border:0;"/>
              <p style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#0b1f3a;">${escapeHtml(EMAIL_BRAND.name)}</p>
              <p style="margin:0;font-size:12px;line-height:1.55;color:#5c6578;">
                ${escapeHtml(EMAIL_BRAND.addressLine1)} · ${escapeHtml(EMAIL_BRAND.addressLine2)}<br/>
                Tél. ${escapeHtml(EMAIL_BRAND.phone)} · ${escapeHtml(EMAIL_BRAND.mobile)}<br/>
                <a href="mailto:${escapeHtml(EMAIL_BRAND.email)}" style="color:#1d5eb0;text-decoration:none;">${escapeHtml(EMAIL_BRAND.email)}</a>
                · <a href="${escapeHtml(EMAIL_BRAND.websiteUrl)}" style="color:#1d5eb0;text-decoration:none;">${escapeHtml(websiteLabel)}</a>
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#8a93a3;">
                SIRET ${escapeHtml(EMAIL_BRAND.siret)} · Déclaration d'activité ${escapeHtml(EMAIL_BRAND.activityDeclaration)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              ${plainTextToHtmlParagraphs(trimmedBody)}
            </td>
          </tr>
          ${buildHtmlFooter()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${trimmedBody}${buildTextFooter()}`;

  return { html, text };
}
