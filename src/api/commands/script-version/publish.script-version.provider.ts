import type { ScriptDto } from "lam-frontend/api/queries/script.provider";
import type { ScriptVersionDto } from "lam-frontend/api/queries/script-version.provider";

export type PublishScriptVersionDto = {
    name: string;
}
export type PublishScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: ScriptVersionDto['id'], dto: PublishScriptVersionDto) => Promise<void>