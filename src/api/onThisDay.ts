const ON_THIS_DAY_URL = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/all';

/** Only the fields the app uses from a Wikipedia page summary. */
export interface WikiPage {
  title: string;
  normalizedtitle: string;
  description?: string;
  extract?: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls?: { desktop: { page: string } };
}

/** A historical event, birth or death. */
export interface OnThisDayItem {
  text: string;
  year: number;
  pages: WikiPage[];
}

export interface OnThisDayResponse {
  events: OnThisDayItem[];
  births: OnThisDayItem[];
  deaths: OnThisDayItem[];
}

export class OnThisDayError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OnThisDayError';
    this.status = status;
  }
}

/**
 * Extracts `MM` and `DD` from a `YYYY-MM-DD` string.
 * Sliced as text instead of `new Date(...)`, which parses as UTC and can shift the day.
 */
export function toMonthDay(date: string): { month: string; day: string } {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  if (!match?.[1] || !match[2]) {
    throw new Error(`Invalid date "${date}", expected YYYY-MM-DD.`);
  }
  return { month: match[1], day: match[2] };
}

/**
 * Fetches historical events, births and deaths for the month/day of `date`.
 * The year is ignored: the feed is the same for 03-15 in any year.
 *
 * Uses the single `all` endpoint (one request) and keeps only events, births and deaths.
 */
export async function fetchOnThisDay(
  date: string,
  signal?: AbortSignal,
): Promise<OnThisDayResponse> {
  const { month, day } = toMonthDay(date);
  const response = await fetch(`${ON_THIS_DAY_URL}/${month}/${day}`, { signal });

  if (!response.ok) {
    throw new OnThisDayError(
      `Failed to load historical events (${response.status}).`,
      response.status,
    );
  }

  const { events, births, deaths } = (await response.json()) as OnThisDayResponse;

  return { events, births, deaths };
}
