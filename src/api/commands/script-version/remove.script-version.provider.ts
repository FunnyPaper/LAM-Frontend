import type { ScriptVersionDto } from "lam-frontend/api/queries/script-version.provider";
import type { ScriptDto } from "lam-frontend/api/queries/script.provider";

export type RemoveScriptVersionDto = ScriptVersionDto['id']
export type RemoveScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: RemoveScriptVersionDto) => Promise<void>
