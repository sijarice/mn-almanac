import './App.css';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import { fetchApod, type ApodResponse } from './api/apod';
import { fetchOnThisDay, type OnThisDayResponse } from './api/onThisDay';

function App() {
  const [data, setData] = useState<ApodResponse | null>(null);
  const [onThisDayData, setOnThisDayData] = useState<OnThisDayResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchApod('2023-06-01', controller.signal)
      .then(setData)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Error fetching APOD:', error);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchOnThisDay('2023-06-01', controller.signal)
      .then(setOnThisDayData)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Error fetching On This Day data:', error);
      });

    return () => controller.abort();
  }, []);

  console.log('Fetched data:', data);
  console.log('Fetched On This Day data:', onThisDayData);

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
