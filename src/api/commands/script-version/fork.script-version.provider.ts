import type { ScriptDto } from "lam-frontend/api/queries/script.provider";
import type { ScriptVersionDto } from "lam-frontend/api/queries/script-version.provider";

export type ForkScriptVersionDto = ScriptVersionDto['id']
export type ForkScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: ForkScriptVersionDto) => Promise<void>