import { useQuery } from '@tanstack/react-query';
import { APOD_FIRST_DATE, fetchApod } from '../api/apod';
import { todayIso } from '../utils/date';

/**
 * NASA Astronomy Picture of the Day for `date` (`YYYY-MM-DD`).
 * `data` is `null` for dates before APOD started or after today (NASA rejects those with a 400),
 * without making a request.
 */
export function useApod(date: string) {
  // Part of the key: a future date becomes fetchable once it is today.
  const today = todayIso();

  return useQuery({
    queryKey: ['apod', date, today],
    queryFn: ({ signal }) =>
      date < APOD_FIRST_DATE || date > today ? null : fetchApod(date, signal),
  });
}
