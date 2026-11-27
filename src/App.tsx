import './App.css';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import { fetchApod, type ApodResponse } from './api/apod';
import { fetchOnThisDay, type OnThisDayResponse } from './api/onThisDay';
import { DEFAULT_LOCATION, fetchWeather, type DailyWeather } from './api/weather';
import { todayIso } from './utils/date';

function App() {
  const [data, setData] = useState<ApodResponse | null>(null);
  const [onThisDayData, setOnThisDayData] = useState<OnThisDayResponse | null>(null);
  const [weatherData, setWeatherData] = useState<DailyWeather | null>(null);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   fetchApod('2023-06-01', controller.signal)
  //     .then(setData)
  //     .catch((error: unknown) => {
  //       if (controller.signal.aborted) return;
  //       console.error('Error fetching APOD:', error);
  //     });

  //   return () => controller.abort();
  // }, []);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   fetchOnThisDay('2023-06-01', controller.signal)
  //     .then(setOnThisDayData)
  //     .catch((error: unknown) => {
  //       if (controller.signal.aborted) return;
  //       console.error('Error fetching On This Day data:', error);
  //     });

  //   return () => controller.abort();
  // }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchWeather('2026-11-27', todayIso(), DEFAULT_LOCATION, controller.signal)
      .then(setWeatherData)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Error fetching weather data:', error);
      });

    return () => controller.abort();
  }, []);

  console.log('Fetched data:', data);
  console.log('Fetched On This Day data:', onThisDayData);
  console.log('Fetched weather data:', weatherData);

  return (
    <>
      <div className="test">
        <h1>{data?.title ?? 'Loading…'}</h1>
        <Button variant="outlined">Click me!</Button>
      </div>
    </>
  );
}

export default App;
