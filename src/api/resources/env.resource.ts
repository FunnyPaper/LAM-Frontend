import type { CreateEnvProvider } from "../commands/env/create.env.provider";
import type { RemoveEnvProvider } from "../commands/env/remove.env.provider";
import type { UpdateEnvProvider } from "../commands/env/update.env.provider";
import type { GetEnvProvider, GetEnvsProvider } from "../queries/env.provider";

export type EnvResource = {
  getOne: GetEnvProvider,
  getAll: GetEnvsProvider,

  create: CreateEnvProvider,
  update: UpdateEnvProvider,
  remove: RemoveEnvProvider
}