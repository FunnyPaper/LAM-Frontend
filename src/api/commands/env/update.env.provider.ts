import type { CreateEnvDto } from "./create.env.provider"

export type UpdateEnvDto = CreateEnvDto
export type UpdateEnvProvider = (data: UpdateEnvDto) => Promise<void>