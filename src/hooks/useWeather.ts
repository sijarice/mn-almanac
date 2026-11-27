import { useQuery } from '@tanstack/react-query';
import { DEFAULT_LOCATION, fetchWeather, type WeatherLocation } from '../api/weather';
import { todayIso } from '../utils/date';

/**
 * Daily weather for `date` (`YYYY-MM-DD`) at `location`.
 * `data` is `null` when the forecast API has no data for that date.
 */
export function useWeather(date: string, location: WeatherLocation = DEFAULT_LOCATION) {
  // Part of the key: whether a date is in range depends on today, so a new day means a new entry.
  const today = todayIso();

  return useQuery({
    queryKey: ['weather', date, today, location],
    queryFn: ({ signal }) => fetchWeather(date, today, location, signal),
  });
}
