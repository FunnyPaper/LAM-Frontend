export type RegisterDto = {
  email: string,
  password: string
}

export type RegisterAuthProvider = (data: RegisterDto) => Promise<void>