import { useContext } from 'react';
import { ApiProvider } from '../../api/api.provider';
import LoginForm from '../../components/forms/login.form';

export default function LoginPage() {
  const { login } = useContext(ApiProvider);

  return <LoginForm onSubmit={login} />;
}
