import { useQuery } from '@tanstack/react-query';
import { APOD_FIRST_DATE, fetchApod } from '../api/apod';

/**
 * NASA Astronomy Picture of the Day for `date` (`YYYY-MM-DD`).
 * `data` is `null` for dates before APOD started, without making a request.
 */
export function useApod(date: string) {
  return useQuery({
    queryKey: ['apod', date],
    queryFn: ({ signal }) => (date < APOD_FIRST_DATE ? null : fetchApod(date, signal)),
  });
}
