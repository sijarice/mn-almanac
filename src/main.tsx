import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import './index.css';
import App from './App.tsx';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 12 },
});

const rootElement = document.getElementById('root')!;

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
