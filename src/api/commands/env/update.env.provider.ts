import type { CreateEnvDto } from "./create.env.provider"

export type UpdateEnvDto = Partial<CreateEnvDto>
export type UpdateEnvProvider = (id: string, data: UpdateEnvDto) => Promise<void>