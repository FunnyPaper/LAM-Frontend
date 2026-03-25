import type { ScriptRunDto } from "lam-frontend/api/queries/script-run.provider.dto";

export type CancelScriptRunDto = ScriptRunDto['id'];
export type CancelScriptRunProvider = (id: CancelScriptRunDto) => Promise<void>