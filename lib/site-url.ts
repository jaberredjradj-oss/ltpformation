const PRODUCTION_FALLBACK_URL = "https://ltpformation.fr";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }
  return PRODUCTION_FALLBACK_URL;
}

/**
 * Public base URL for outbound emails (logo, website link, admin links in notifications).
 * Never returns localhost — external mail clients cannot load local assets.
 */
export function getEmailPublicBaseUrl(): string {
  const emailBase = process.env.EMAIL_PUBLIC_BASE_URL?.trim();
  if (emailBase) {
    const normalized = trimTrailingSlash(emailBase);
    if (!isLocalhostUrl(normalized)) {
      return normalized;
    }
  }

  const siteUrl = getSiteUrl();
  if (isLocalhostUrl(siteUrl)) {
    return PRODUCTION_FALLBACK_URL;
  }

  return siteUrl;
}
