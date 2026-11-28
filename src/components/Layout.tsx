import { Link as RouterLink, Outlet } from 'react-router';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

/**
 * Shared shell for every page: a top bar, and the current child route rendered in `<Outlet />`.
 * MUI components render a plain `<a>` (full page reload), so `component={RouterLink}` swaps in
 * React Router's link, which navigates on the client.
 */
const Layout = () => (
  <Box sx={{ minHeight: '100vh' }}>
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          Almanac
        </Typography>
        <Button color="inherit" component={RouterLink} to="/bookmarks">
          Bookmarks
        </Button>
      </Toolbar>
    </AppBar>

    <Container component="main" maxWidth="md" sx={{ py: 3 }}>
      <Outlet />
    </Container>
  </Box>
);

export default Layout;
