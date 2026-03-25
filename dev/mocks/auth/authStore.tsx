import type { LoginAuthProvider } from 'lam-frontend/api/commands/auth/login.auth.provider';
import type { LogoutAuthProvider } from 'lam-frontend/api/commands/auth/logout.auth.provider';
import { create } from 'zustand';

type AuthStoreState = {
  state: 'loading' | 'loggedIn' | 'loggedOut';
  login: LoginAuthProvider;
  logout: LogoutAuthProvider;
};

export const authStore = create<AuthStoreState>((set) => ({
  state: 'loading',
  login: async () => set({ state: 'loggedIn' }),
  logout: async () => set({ state: 'loggedOut' }),
}));
