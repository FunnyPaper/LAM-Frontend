import { createContext } from "react"
import type { LoginProvider } from "./login.provider"
import type { RegisterProvider } from "./register.provider"

export type ApiProviders = {
  login: LoginProvider,
  register: RegisterProvider
}

export const noops: Required<ApiProviders> = {
  login: async () => {},
  register: async () => {}
}

export const ApiProvider = createContext<ApiProviders>(noops)