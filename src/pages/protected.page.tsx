import { CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router';

export type ProtectedPageProps = {
  authState: 'loading' | 'loggedIn' | 'loggedOut';
};

export function ProtectedPage({ authState }: ProtectedPageProps) {
  const location = useLocation();

  if (authState == 'loading') {
    return <CircularProgress />;
  }

  if (authState == 'loggedOut') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
