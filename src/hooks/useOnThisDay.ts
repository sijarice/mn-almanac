import { useQuery } from '@tanstack/react-query';
import { fetchOnThisDay, toMonthDay } from '../api/onThisDay';

/**
 * Historical events, births and deaths for the month/day of `date` (`YYYY-MM-DD`).
 * Keyed by month/day only: the feed is the same in every year, so 2024-03-15 and 1999-03-15
 * share one cache entry and one request.
 */
export function useOnThisDay(date: string) {
  const { month, day } = toMonthDay(date);

  return useQuery({
    queryKey: ['onThisDay', month, day],
    queryFn: ({ signal }) => fetchOnThisDay(month, day, signal),
  });
}
