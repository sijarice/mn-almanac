import { useApod } from './hooks/useApod';
import { useOnThisDay } from './hooks/useOnThisDay';
import { useWeather } from './hooks/useWeather';
import { todayIso } from './utils/date';

// Temporary: becomes the `/date/:date` URL parameter once routing is added.
const date = todayIso();

function App() {
  const onThisDay = useOnThisDay(date);
  const weather = useWeather(date);
  const apod = useApod(date);

  console.log('onThisDay', onThisDay.data);
  console.log('weather', weather.data);
  console.log('apod', apod.data);

  return <h1>Hello World</h1>;
}

export default App;
