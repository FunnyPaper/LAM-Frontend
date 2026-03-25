import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { useThemeStore } from 'lam-frontend/stores/theme.store';
import { useMemo, type ReactNode } from 'react';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { themeMode } = useThemeStore();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const resolvedMode = themeMode == 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
        },
      }),
    [resolvedMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
