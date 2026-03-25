import type { CreateScriptProvider } from "../commands/script/create.script.provider";
import type { RemoveScriptProvider } from "../commands/script/remove.script.provider";
import type { UpdateScriptProvider } from "../commands/script/update.script.provider";
import type { GetScriptProvider, GetScriptsProvider } from "../queries/script.provider";
import type { GetScriptSchemaProvider } from "../queries/script-schema.provider";

export type ScriptResource = {
  getOne: GetScriptProvider,
  getAll: GetScriptsProvider,

  create: CreateScriptProvider,
  remove: RemoveScriptProvider,
  update: UpdateScriptProvider,
  getJsonSchema: GetScriptSchemaProvider
}
