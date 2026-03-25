import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginPage } from './pages/login/login.page';
import { ApiProvider, type ApiProviders } from './providers/api.provider';
import { RegisterPage } from './pages/register/register.page';
import { DashboardLayout } from './components/layouts/dashboard.layout';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { ProfilePage } from './pages/profile/profile.page';
import { EnvsPage } from './pages/envs/envs.page';
import { ScriptsPage } from './pages/scripts/scripts.page';
import { RunsPage } from './pages/runs/runs.page';
import { SettingsPage } from './pages/settings/settings.page';
import { ScriptsDetailsPage } from './pages/scripts/scripts.details.page';
import { RunsDetailsPage } from './pages/runs/runs.details.page';
import { ProtectedPage } from './pages/protected.page';
import { PublicPage } from './pages/public.page';
import { AppThemeProvider } from './providers/app.theme.provider';

export type AppProps = {
  authState: 'loading' | 'loggedIn' | 'loggedOut';
  apiProviders: ApiProviders;
};

export function App(props: AppProps) {
  return (
    <ApiProvider value={props.apiProviders}>
      <AppThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedPage authState={props.authState} />}>
              <Route element={<DashboardLayout />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="envs" element={<EnvsPage />} />
                <Route path="scripts">
                  <Route index element={<ScriptsPage />} />
                  <Route path=":id" element={<ScriptsDetailsPage />} />
                </Route>
                <Route path="runs">
                  <Route index element={<RunsPage />} />
                  <Route path=":id" element={<RunsDetailsPage />} />
                </Route>
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route element={<PublicPage authState={props.authState} />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/profile" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppThemeProvider>
    </ApiProvider>
  );
}
