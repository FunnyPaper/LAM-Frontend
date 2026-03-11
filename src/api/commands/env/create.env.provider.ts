export type CreateEnvDto = {
  name: string,
  description?: string,
  data?: Record<string, string>
}

export type CreateEnvProvider = (data: CreateEnvDto) => Promise<void>