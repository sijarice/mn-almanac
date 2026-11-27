import { daysBetween } from '../utils/date';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// TODO
/** For every weather code find appropriate image and put it as background for forecast cards */

/**
 * Documented limits: `past_days` up to 92 and `forecast_days` up to 16 (today + 15).
 * Days near either edge may still come back all null; `fetchWeather` treats that as no data.
 */
const FORECAST_MAX_DAYS_BACK = 92;
/** The API's `forecast_days` max is 16, counting today, so the last forecast day is today + 15. */
export const FORECAST_MAX_DAYS_AHEAD = 15;

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'rain_sum',
  'snowfall_sum',
  'precipitation_hours',
  'sunshine_duration',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
] as const;

type DailyField = (typeof DAILY_FIELDS)[number];

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Sarajevo International Airport',
  latitude: 43.8261,
  longitude: 18.3368,
};

/** Raw response: each daily field is an array with one entry per day; values can be null. */
interface OpenMeteoResponse {
  daily: { time: string[] } & Record<DailyField, (number | null)[]>;
}

/** Weather for a single day, flattened from the response arrays. Any value can be null. */
export interface DailyWeather {
  date: string;
  /** WMO weather interpretation code (0 = clear sky, 61 = slight rain, ...). */
  weatherCode: number | null;
  /** °C */
  temperatureMax: number | null;
  /** °C */
  temperatureMin: number | null;
  /** Rain + showers + snow, in mm. */
  precipitationSum: number | null;
  /** mm */
  rainSum: number | null;
  /** cm */
  snowfallSum: number | null;
  /** Hours with precipitation. */
  precipitationHours: number | null;
  /** Hours of sunshine (the API returns seconds). */
  sunshineHours: number | null;
  /** km/h */
  windSpeedMax: number | null;
  /** km/h */
  windGustsMax: number | null;
  /** Degrees the wind comes from (0 = north, 90 = east). */
  windDirection: number | null;
}

export class WeatherError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'WeatherError';
    this.status = status;
  }
}

/** Whether the forecast API covers `date`, relative to `today` (both `YYYY-MM-DD`). */
export function isWeatherAvailable(date: string, today: string): boolean {
  const offset = daysBetween(today, date);
  return offset >= -FORECAST_MAX_DAYS_BACK && offset <= FORECAST_MAX_DAYS_AHEAD;
}

/**
 * Fetches the daily weather for `date` at `location`.
 * Returns `null` when the date is outside the forecast API's range or the API has no values for it.
 */
export async function fetchWeather(
  date: string,
  today: string,
  location: WeatherLocation = DEFAULT_LOCATION,
  signal?: AbortSignal,
): Promise<DailyWeather | null> {
  if (!isWeatherAvailable(date, today)) return null;

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    start_date: date,
    end_date: date,
    daily: DAILY_FIELDS.join(','),
    timezone: 'auto',
  });
  const response = await fetch(`${FORECAST_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new WeatherError(`Failed to load weather (${response.status}).`, response.status);
  }

  const { daily } = (await response.json()) as OpenMeteoResponse;
  const value = (field: DailyField) => daily[field][0] ?? null;

  if (DAILY_FIELDS.every((field) => value(field) === null)) return null;

  const sunshineSeconds = value('sunshine_duration');

  return {
    date,
    weatherCode: value('weather_code'),
    temperatureMax: value('temperature_2m_max'),
    temperatureMin: value('temperature_2m_min'),
    precipitationSum: value('precipitation_sum'),
    rainSum: value('rain_sum'),
    snowfallSum: value('snowfall_sum'),
    precipitationHours: value('precipitation_hours'),
    sunshineHours: sunshineSeconds === null ? null : sunshineSeconds / 3600,
    windSpeedMax: value('wind_speed_10m_max'),
    windGustsMax: value('wind_gusts_10m_max'),
    windDirection: value('wind_direction_10m_dominant'),
  };
}
