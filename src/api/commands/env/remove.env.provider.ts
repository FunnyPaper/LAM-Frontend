import type { EnvDto } from "../../queries/env.provider"

export type RemoveEnvDto = EnvDto['id']
export type RemoveEnvProvider = (id: RemoveEnvDto) => Promise<void>