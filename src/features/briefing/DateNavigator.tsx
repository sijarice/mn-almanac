import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { addDays, formatLongDate } from '../../utils/date';

interface DateNavigatorProps {
  /** The date being shown, `YYYY-MM-DD`. */
  date: string;
  /** The latest date allowed; Next is disabled once it's reached. */
  maxDate: string;
  /** Called with the new `YYYY-MM-DD` date. The parent decides what changing the date means. */
  onDateChange: (date: string) => void;
}

/**
 * Previous / next day controls around the formatted date.
 * Controlled: it holds no state and knows nothing about routing, it only reports the date the user picked.
 */
const DateNavigator = ({ date, maxDate, onDateChange }: DateNavigatorProps) => {
  const previous = addDays(date, -1);
  const next = addDays(date, 1);
  const isNextDisabled = next > maxDate;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
    >
      <Tooltip title="Previous day">
        <IconButton aria-label="Previous day" onClick={() => onDateChange(previous)}>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
        {formatLongDate(date)}
      </Typography>

      {/* A disabled button fires no mouse events, so the Tooltip needs a wrapper element to listen on. */}
      <Tooltip title="Next day">
        <span>
          <IconButton
            aria-label="Next day"
            disabled={isNextDisabled}
            onClick={() => onDateChange(next)}
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DateNavigator;
