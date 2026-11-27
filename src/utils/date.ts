const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Today's date in the user's local time zone, as `YYYY-MM-DD`. */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Calendar days from `from` to `to` (both `YYYY-MM-DD`). Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return (toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY;
}

/** Parses `YYYY-MM-DD` as a UTC midnight timestamp, so time zones and DST never shift the day. */
function toUtcMs(date: string): number {
  const match = ISO_DATE.exec(date);
  if (!match) {
    throw new Error(`Invalid date "${date}", expected YYYY-MM-DD.`);
  }
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
