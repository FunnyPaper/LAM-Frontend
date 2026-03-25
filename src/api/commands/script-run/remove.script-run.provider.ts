import type { ScriptRunDto } from "lam-frontend/api/queries/script-run.provider.dto";

export type RemoveScriptRunDto = ScriptRunDto['id'];
export type RemoveScriptRunProvider = (id: RemoveScriptRunDto) => Promise<void>;