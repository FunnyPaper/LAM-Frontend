import type { ScriptDto } from "lam-frontend/api/queries/script.provider";
import type { ScriptVersionDto } from "lam-frontend/api/queries/script-version.provider";

export type ArchiveScriptVersionDto = ScriptVersionDto['id']
export type ArchiveScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: ArchiveScriptVersionDto) => Promise<void>