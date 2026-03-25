import type { AuthResource } from 'lam-frontend/api/resources/auth.resource';
import { authStore } from './authStore';

export function useAuthResourceHook(): AuthResource {
  const { logout, login } = authStore();

  return {
    login: login,
    logout: logout,
    register: login,
  };
}
