import type { ArchiveScriptVersionProvider } from "../commands/script-version/archive.script-version.provider";
import type { CreateScriptVersionProvider } from "../commands/script-version/create.script-version.provider";
import type { ForkScriptVersionProvider } from "../commands/script-version/fork.script-version.provider";
import type { PublishScriptVersionProvider } from "../commands/script-version/publish.script-version.provider";
import type { RemoveScriptVersionProvider } from "../commands/script-version/remove.script-version.provider";
import type { UpdateScriptVersionProvider } from "../commands/script-version/update.script-version.provider";
import type { GetScriptVersionProvider, GetScriptVersionsProvider } from "../queries/script-version.provider";

export type ScriptVersionResource = {
  getOne: GetScriptVersionProvider,
  getAll: GetScriptVersionsProvider,

  create: CreateScriptVersionProvider,
  fork: ForkScriptVersionProvider,
  publish: PublishScriptVersionProvider,
  archive: ArchiveScriptVersionProvider,
  remove: RemoveScriptVersionProvider,
  update: UpdateScriptVersionProvider
}