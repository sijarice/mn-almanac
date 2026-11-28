import { useNavigate, useParams } from 'react-router';
import { Typography } from '@mui/material';
import { formatLongDate, todayIso } from '../../utils/date';
import Briefing from './Briefing';
import DateNavigator from './DateNavigator';
import { maxSelectableDate } from './dateLimits';

const DatePage = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  if (!date) return null;

  const today = todayIso();

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        {formatLongDate(date)}
      </Typography>

      <DateNavigator
        date={date}
        today={today}
        maxDate={maxSelectableDate(today)}
        onDateChange={(newDate) => void navigate(`/date/${newDate}`)}
      />

      <Briefing key={date} date={date} />
    </>
  );
};

export default DatePage;
