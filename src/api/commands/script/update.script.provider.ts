import type { CreateScriptDto } from "./create.script.provider";

export type UpdateScriptDto = Partial<CreateScriptDto>
export type UpdateScriptProvider = (id: string, data: UpdateScriptDto) => Promise<void>