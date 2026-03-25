import type { LoginAuthProvider } from "../commands/auth/login.auth.provider";
import type { LogoutAuthProvider } from "../commands/auth/logout.auth.provider";
import type { RegisterAuthProvider } from "../commands/auth/register.auth.provider";

export type AuthResource = {
  login: LoginAuthProvider,
  logout: LogoutAuthProvider,
  register: RegisterAuthProvider
}