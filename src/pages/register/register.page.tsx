import { useContext } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { RegisterForm } from '../../components/forms/register.form';
import { useNavigate } from 'react-router';
import type { RegisterDto } from 'lam-frontend/api/commands/auth/register.auth.provider';

export function RegisterPage() {
  const { auth } = useContext(ApiProvider)!;
  const navigate = useNavigate();

  const redirectTo = '/profile';
  const handleRegister = async (data: RegisterDto) => {
    await auth.login(data);
    navigate(redirectTo, { replace: true });
  };

  return <RegisterForm onSubmit={handleRegister} />;
}
