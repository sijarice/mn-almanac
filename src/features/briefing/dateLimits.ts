import { FORECAST_MAX_DAYS_AHEAD } from '../../api/weather';
import { addDays } from '../../utils/date';

/** The latest date the app lets you open: the last day of the weather forecast. */
export function maxSelectableDate(today: string): string {
  return addDays(today, FORECAST_MAX_DAYS_AHEAD);
}
