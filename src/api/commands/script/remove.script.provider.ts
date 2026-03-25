import type { ScriptDto } from "lam-frontend/api/queries/script.provider";

export type RemoveScriptDto = ScriptDto['id']
export type RemoveScriptProvider = (id: RemoveScriptDto) => Promise<void>