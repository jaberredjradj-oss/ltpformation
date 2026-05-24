const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDayMonth(dateIso: string): string {
  const date = parseIsoDate(dateIso);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]}`;
}

export function formatDayMonthYear(dateIso: string): string {
  const date = parseIsoDate(dateIso);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatSessionDateRange(startDate: string, endDate: string): string {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  if (startDate === endDate) {
    return formatDayMonthYear(startDate);
  }

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} au ${end.getDate()} ${MONTHS_FR[start.getMonth()]} ${start.getFullYear()}`;
  }

  return `${formatDayMonth(startDate)} au ${formatDayMonthYear(endDate)}`;
}

export function formatMonthGroupLabel(startDate: string): string {
  const date = parseIsoDate(startDate);
  const month =
    MONTHS_FR[date.getMonth()].charAt(0).toUpperCase() +
    MONTHS_FR[date.getMonth()].slice(1);
  return `${month} ${date.getFullYear()}`;
}

export function formatMonthGroupKey(startDate: string): string {
  const date = parseIsoDate(startDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function formatExamLabel(examDate: string): string {
  return `Examen le ${formatDayMonthYear(examDate)}`;
}
