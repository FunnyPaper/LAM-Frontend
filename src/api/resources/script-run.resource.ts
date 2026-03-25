import type { CancelScriptRunProvider } from "../commands/script-run/cancel.script-run.provider";
import type { CreateScriptRunProvider } from "../commands/script-run/create.script-run.provider";
import type { ReexecuteScriptRunProvider } from "../commands/script-run/reexecute.script-run.provider";
import type { RemoveScriptRunProvider } from "../commands/script-run/remove.script-run.provider";
import type { GetScriptRunProvider, GetScriptRunsProvider } from "../queries/script-run.provider.dto";

export type ScriptRunResource = {
  getOne: GetScriptRunProvider,
  getAll: GetScriptRunsProvider,
  
  cancel: CancelScriptRunProvider,
  create: CreateScriptRunProvider,
  reexecute: ReexecuteScriptRunProvider,
  remove: RemoveScriptRunProvider
}