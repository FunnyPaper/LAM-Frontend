import type { EnvDto } from "lam-frontend/api/queries/env.provider";

export type RemoveEnvDto = EnvDto['id']
export type RemoveEnvProvider = (id: RemoveEnvDto) => Promise<void>