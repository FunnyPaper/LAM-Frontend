import type { ScriptDto } from "lam-frontend/api/queries/script.provider";
import type { CreateScriptVersionDto } from "./create.script-version.provider";

export type UpdateScriptVersionDto = Partial<CreateScriptVersionDto>
export type UpdateScriptVersionProvider = (scriptId: ScriptDto['id'], scriptVersionId: string, data: UpdateScriptVersionDto) => Promise<void>