const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Today's date in the user's local time zone, as `YYYY-MM-DD`. */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Whether `date` is a real calendar date in `YYYY-MM-DD` format.
 * The regex alone accepts `2024-02-30`, and `Date` silently rolls it over to March 1,
 * so the parts are read back to check nothing rolled over.
 */
export function isValidIsoDate(date: string): boolean {
  const match = ISO_DATE.exec(date);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/** `date` (`YYYY-MM-DD`) moved by `days` (negative for earlier), as `YYYY-MM-DD`. */
export function addDays(date: string, days: number): string {
  return new Date(toUtcMs(date) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Calendar days from `from` to `to` (both `YYYY-MM-DD`). Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return (toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY;
}

/**
 * `date` (`YYYY-MM-DD`) for display, e.g. "Friday, November 27, 2026" (wording depends on `locale`,
 * which defaults to the browser's). Formatted in UTC, the same zone `toUtcMs` parses in,
 * so the user's time zone can't shift it to the day before.
 */
export function formatLongDate(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(toUtcMs(date));
}

/** Parses `YYYY-MM-DD` as a UTC midnight timestamp, so time zones and DST never shift the day. */
function toUtcMs(date: string): number {
  const match = ISO_DATE.exec(date);
  if (!match) {
    throw new Error(`Invalid date "${date}", expected YYYY-MM-DD.`);
  }
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
