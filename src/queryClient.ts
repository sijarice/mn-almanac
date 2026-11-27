import { QueryClient } from '@tanstack/react-query';

const MINUTE = 60 * 1000;

/** Client errors (4xx, e.g. 404 or a 429 rate limit) will fail the same way again, so don't retry them. */
function isClientError(error: unknown): boolean {
  if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
    return error.status >= 400 && error.status < 500;
  }
  return false;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Historical data doesn't change; avoid refetching dates the user already visited.
      staleTime: 5 * MINUTE,
      // Keep data for dates the user navigated away from, so going back is instant.
      gcTime: 30 * MINUTE,
      // One retry for network blips, none for client errors.
      retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
      // An almanac isn't live data; switching browser tabs shouldn't trigger requests.
      refetchOnWindowFocus: false,
    },
  },
});
