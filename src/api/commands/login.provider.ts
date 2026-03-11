export type LoginDto = {
  email: string,
  password: string
}

export type LoginProvider = (data: LoginDto) => Promise<void>