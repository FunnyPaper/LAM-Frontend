import { useContext } from 'react';
import { ApiProvider } from '../../api/api.provider';
import RegisterForm from '../../components/forms/register.form';

export default function RegisterPage() {
  const { register } = useContext(ApiProvider);

  return <RegisterForm onSubmit={register} />;
}
