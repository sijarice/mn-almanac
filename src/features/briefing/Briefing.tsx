import type { ReactNode } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import { useApod } from '../../hooks/useApod';
import { useOnThisDay } from '../../hooks/useOnThisDay';
import { useWeather } from '../../hooks/useWeather';

interface SectionProps<T> {
  title: string;
  query: UseQueryResult<T | null>;
  children: (data: T) => ReactNode;
}

/** Temporary section shell: shows loading / error / no data, or the data via `children`. */
function Section<T>({ title, query, children }: SectionProps<T>) {
  let content: ReactNode;
  if (query.isPending) content = 'Loading…';
  else if (query.isError) content = `Could not load: ${query.error.message}`;
  else if (query.data === null) content = 'No data for this date.';
  else content = children(query.data);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography component="div" color="text.secondary">
        {content}
      </Typography>
    </Paper>
  );
}

interface BriefingProps {
  date: string;
}

const Briefing = ({ date }: BriefingProps) => {
  const onThisDay = useOnThisDay(date);
  const weather = useWeather(date);
  const apod = useApod(date);

  return (
    <Stack spacing={2}>
      <Section title="Weather" query={weather}>
        {(day) => `${day.temperatureMin ?? '?'}°C – ${day.temperatureMax ?? '?'}°C`}
      </Section>
      <Section title="Astronomy Picture of the Day" query={apod}>
        {(picture) => picture.title}
      </Section>
      <Section title="On this day" query={onThisDay}>
        {(feed) =>
          `${feed.events.length} events, ${feed.births.length} births, ${feed.deaths.length} deaths`
        }
      </Section>
    </Stack>
  );
};

export default Briefing;
