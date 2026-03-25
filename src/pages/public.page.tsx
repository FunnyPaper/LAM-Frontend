import { CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router';

export type PublicPageProps = {
  authState: 'loading' | 'loggedIn' | 'loggedOut';
};

export function PublicPage({ authState }: PublicPageProps) {
  if (authState == 'loading') {
    return <CircularProgress />;
  }

  if (authState == 'loggedIn') {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
