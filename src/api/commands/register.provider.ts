export type RegisterDto = {
  email: string,
  password: string
}

export type RegisterProvider = (data: RegisterDto) => Promise<void>