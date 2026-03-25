export type LoginDto = {
  email: string,
  password: string
}

export type LoginAuthProvider = (data: LoginDto) => Promise<void>