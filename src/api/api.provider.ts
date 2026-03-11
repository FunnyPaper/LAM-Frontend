import { createContext } from "react"
import type { LoginProvider } from "./commands/login.provider"
import type { RegisterProvider } from "./commands/register.provider"
import type { GetProfileProvider } from "./queries/profile.provider"
import type { GetEnvProvider, GetEnvsProvider } from "./queries/env.provider"
import type { UpdateProfileProvider } from "./commands/profile/update.profile.provider"
import type { UpdateEnvProvider } from "./commands/env/update.env.provider"
import type { RemoveEnvProvider } from "./commands/env/remove.env.provider"
import type { CreateEnvProvider } from "./commands/env/create.env.provider"

export type ApiProviders = {
  login: LoginProvider,
  register: RegisterProvider,
  getProfile: GetProfileProvider,
  updateProfile: UpdateProfileProvider,
  getEnvs: GetEnvsProvider,
  getEnv: GetEnvProvider,
  createEnv: CreateEnvProvider,
  updateEnv: UpdateEnvProvider,
  removeEnv: RemoveEnvProvider,
}

export const noops: Required<ApiProviders> = {
  login: async () => {},
  register: async () => {},
  getProfile: async () => ({ email: "email" }),
  updateProfile: async () => {},
  getEnvs: async () => ([{ id: '1', name: 'name' }]),
  getEnv: async () => ({ id: '1', name: "name" }),
  createEnv: async () => {},
  updateEnv: async () => {},
  removeEnv: async () => {}
}

export const ApiProvider = createContext<ApiProviders>(noops)