const APOD_URL = 'https://api.nasa.gov/planetary/apod';

/** First date with an Astronomy Picture of the Day. */
export const APOD_FIRST_DATE = '1995-06-16';

const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

/** Only the fields the app uses from the APOD response. */
export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video' | 'other';
  copyright?: string;
  thumbnail_url?: string;
}

export class ApodError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApodError';
    this.status = status;
  }
}

/** Fetches the APOD entry for a date in `YYYY-MM-DD` format. */
export async function fetchApod(date: string, signal?: AbortSignal): Promise<ApodResponse> {
  const params = new URLSearchParams({ date, api_key: apiKey, thumbs: 'true' });
  const response = await fetch(`${APOD_URL}?${params}`, { signal });

  if (!response.ok) {
    const message =
      response.status === 429
        ? 'NASA API rate limit reached. Try again later.'
        : `Failed to load astronomy picture (${response.status}).`;
    throw new ApodError(message, response.status);
  }

  return (await response.json()) as ApodResponse;
}
