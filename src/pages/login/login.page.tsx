import { useContext } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { LoginForm } from '../../components/forms/login.form';
import { useLocation, useNavigate } from 'react-router';
import type { LoginDto } from 'lam-frontend/api/commands/auth/login.auth.provider';

export function LoginPage() {
  const { auth } = useContext(ApiProvider)!;
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = location.state?.from?.pathname || '/profile';
  const handleLogin = async (data: LoginDto) => {
    await auth.login(data);
    navigate(redirectTo, { replace: true });
  };

  return <LoginForm onSubmit={handleLogin} />;
}
