import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers/models';
import dayjs, { type Dayjs } from 'dayjs';
import { addDays } from '../../utils/date';

const ISO_FORMAT = 'YYYY-MM-DD';

interface DateNavigatorProps {
  date: string;
  today: string;
  maxDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigator = ({ date, today, maxDate, onDateChange }: DateNavigatorProps) => {
  const previous = addDays(date, -1);
  const next = addDays(date, 1);
  const isNextDisabled = next > maxDate;

  const handlePickerChange = (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<DateValidationError>,
  ) => {
    if (value?.isValid() && context.validationError === null) {
      onDateChange(value.format(ISO_FORMAT));
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}
    >
      <Tooltip title="Previous day">
        <IconButton aria-label="Previous day" onClick={() => onDateChange(previous)}>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <DatePicker
        label="Date"
        value={dayjs(date)}
        maxDate={dayjs(maxDate)}
        onChange={handlePickerChange}
        slotProps={{ textField: { size: 'small', sx: { width: 170 } } }}
      />

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

      <Button variant="outlined" disabled={date === today} onClick={() => onDateChange(today)}>
        Today
      </Button>
    </Stack>
  );
};

export default DateNavigator;
