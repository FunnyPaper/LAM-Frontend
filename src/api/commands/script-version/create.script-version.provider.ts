import type { ScriptSourceFormat } from "lam-frontend/api/queries/script-version.provider";
import type { ScriptDto } from "lam-frontend/api/queries/script.provider";

export type CreateScriptContentDto = {
  astJson: Record<string, unknown>;
  astVersion: number;
  engineVersion: number;
}

export type CreateScriptSourceDto = {
  format: ScriptSourceFormat;
  content: string;
}

export type CreateScriptVersionDto = {
  content: CreateScriptContentDto,
  source: CreateScriptSourceDto,
}

export type CreateScriptVersionProvider = (scriptId: ScriptDto['id'], data: CreateScriptVersionDto) => Promise<{ id: string }>