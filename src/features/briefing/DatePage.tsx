import { useNavigate, useParams } from 'react-router';
import { todayIso } from '../../utils/date';
import DateNavigator from './DateNavigator';
import { maxSelectableDate } from './dateLimits';

const DatePage = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  // The route's loader already redirects bad dates, so this only satisfies TypeScript
  // (`useParams` types every param as `string | undefined`).
  if (!date) return null;

  return (
    <DateNavigator
      date={date}
      maxDate={maxSelectableDate(todayIso())}
      // Push (no `replace`), so browser Back steps through the days you visited.
      onDateChange={(newDate) => void navigate(`/date/${newDate}`)}
    />
  );
};

export default DatePage;
