import { createBrowserRouter } from 'react-router';
import DatePage from './features/briefing/DatePage';

export const router = createBrowserRouter([
  {
    path: 'date/:date',
    element: <DatePage />,
  },
]);
