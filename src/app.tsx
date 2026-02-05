import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/login/login.page';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { ApiProvider, noops, type ApiProviders } from './api/api.provider';
import RegisterPage from './pages/register/register.page';
import DashboardLayout from './components/layouts/dashboard.layout';
import NotFoundPage from './pages/not-found/not-found.page';
import ProfilePage from './pages/profile/profile.page';
import EnvsPage from './pages/envs/envs.page';
import ScriptsPage from './pages/scripts/scripts.page';
import RunsPage from './pages/runs/runs.page';
import SettingsPage from './pages/settings/settings.page';

export type AppProps = {
  apiProviders?: ApiProviders;
};

export default function App(props?: AppProps) {
  const { apiProviders } = useMemo(() => props || {}, [props]);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const apiProvides: ApiProviders = useMemo(
    () => ({
      ...noops,
      ...apiProviders,
    }),
    [apiProviders]
  );

  return (
    <ApiProvider value={apiProvides}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/envs" element={<EnvsPage />} />
              <Route path="/scripts" element={<ScriptsPage />} />
              <Route path="/runs" element={<RunsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApiProvider>
  );
}
