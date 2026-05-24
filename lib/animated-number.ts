export type ParsedAnimatedNumber = {
  end: number;
  decimals: number;
  prefix: string;
  suffix: string;
  displayValue: string;
};

export function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

function parseFrenchNumber(value: string): number {
  return Number.parseFloat(value.replace(/\s/g, "").replace(",", "."));
}

function countFrenchDecimals(value: string): number {
  const commaIndex = value.indexOf(",");
  if (commaIndex === -1) return 0;
  return value.slice(commaIndex + 1).replace(/\s/g, "").length;
}

export function normalizeStatSuffix(suffix: string): string {
  return suffix.replace(/\s+(?=%)/g, "\u00A0");
}

export function formatAnimatedNumber(
  value: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    locale?: string;
  } = {},
): string {
  const { decimals = 0, prefix = "", suffix = "", locale = "fr-FR" } = options;

  const formatted =
    decimals > 0
      ? value.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(value).toLocaleString(locale);

  return `${prefix}${formatted}${suffix}`;
}

export function parseAnimatedNumber(input: string | number): ParsedAnimatedNumber | null {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;

    const raw = String(input);
    const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;

    return {
      end: input,
      decimals,
      prefix: "",
      suffix: "",
      displayValue: formatAnimatedNumber(input, { decimals }),
    };
  }

  const raw = input.trim();
  if (!raw) return null;

  const ratingMatch = raw.match(/^([\d\s,]+)\/(\d+)$/);
  if (ratingMatch) {
    const end = parseFrenchNumber(ratingMatch[1]);
    if (Number.isNaN(end)) return null;

    const decimals = countFrenchDecimals(ratingMatch[1]);
    const suffix = `/${ratingMatch[2]}`;

    return {
      end,
      decimals,
      prefix: "",
      suffix,
      displayValue: formatAnimatedNumber(end, { decimals, suffix }),
    };
  }

  const numericMatch = raw.match(/^([\d\s,]+)(.*)$/);
  if (!numericMatch) return null;

  const end = parseFrenchNumber(numericMatch[1]);
  if (Number.isNaN(end)) return null;

  const decimals = countFrenchDecimals(numericMatch[1]);
  const suffix = normalizeStatSuffix(numericMatch[2]);

  return {
    end,
    decimals,
    prefix: "",
    suffix,
    displayValue: formatAnimatedNumber(end, { decimals, suffix }),
  };
}
