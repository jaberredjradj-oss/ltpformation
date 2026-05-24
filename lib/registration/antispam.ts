/** Minimum time (ms) a human typically needs before submitting. */
export const MIN_FORM_DURATION_MS = 3_000;

/** Hidden field name — must stay empty; avoid common autofill names like "website". */
export const HONEYPOT_FIELD = "_hp_trap";

export interface AntispamPayload {
  honeypot?: string;
  formLoadedAt: number;
}

export function isLikelySpam(payload: AntispamPayload): boolean {
  if (payload.honeypot?.trim()) {
    return true;
  }

  const elapsed = Date.now() - payload.formLoadedAt;
  if (!Number.isFinite(payload.formLoadedAt) || elapsed < MIN_FORM_DURATION_MS) {
    return true;
  }

  return false;
}
