import { FORECAST_MAX_DAYS_AHEAD } from '../../api/weather';
import { addDays } from '../../utils/date';

export function maxSelectableDate(today: string): string {
  return addDays(today, FORECAST_MAX_DAYS_AHEAD);
}
