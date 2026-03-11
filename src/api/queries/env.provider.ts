export type EnvDto = {
  id: string,
  name: string,
  description?: string,
  data?: Record<string, string | undefined>
}

export type GetEnvsProvider = () => Promise<EnvDto[]>
export type GetEnvProvider = (id: string) => Promise<EnvDto>
