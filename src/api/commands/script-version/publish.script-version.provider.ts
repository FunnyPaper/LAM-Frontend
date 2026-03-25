import type { ScriptDto } from "lam-frontend/api/queries/script.provider";
import type { ScriptVersionDto } from "lam-frontend/api/queries/script-version.provider";

export type PublishScriptVersionDto = ScriptVersionDto['id']
export type PublishScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: PublishScriptVersionDto) => Promise<void>