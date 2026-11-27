import { createBrowserRouter, redirect } from 'react-router';
import Layout from './components/Layout';
import DatePage from './features/briefing/DatePage';
import BookmarksPage from './features/bookmarks/BookmarksPage';
import { FORECAST_MAX_DAYS_AHEAD } from './api/weather';
import { addDays, isValidIsoDate, todayIso } from './utils/date';

export const router = createBrowserRouter([
  {
    // The loader runs on every navigation to `/`, before anything renders,
    // so `todayIso()` is always fresh (a tab left open past midnight gets the new day).
    path: '/',
    loader: () => redirect(`/date/${todayIso()}`),
  },
  {
    // Layout route: no `path`, so it adds nothing to the URL. It wraps its children,
    // which render inside its `<Outlet />`.
    element: <Layout />,
    children: [
      {
        path: 'date/:date',
        // Runs before DatePage renders, so DatePage only ever sees a real date within the forecast range.
        // ISO `YYYY-MM-DD` strings compare in date order, so `>` works on them directly.
        loader: ({ params }) => {
          const { date } = params;
          const maxDate = addDays(todayIso(), FORECAST_MAX_DAYS_AHEAD);
          if (!date || !isValidIsoDate(date) || date > maxDate) {
            return redirect('/');
          }
          return null;
        },
        element: <DatePage />,
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />,
      },
    ],
  },
  {
    // Any URL no other route matches goes to `/`, which then redirects to today.
    path: '*',
    loader: () => redirect('/'),
  },
]);
