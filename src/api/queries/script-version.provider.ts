import type { DataSource } from "../resources/datasource";
import type { Paginated } from "./paginated.provider";

export const ScriptVersionStatuses = ['Draft', 'Published', 'Archived'] as const;

export type ScriptVersionStatus = typeof ScriptVersionStatuses[number];

export type ScriptContentDto = {
  astJson?: Record<string, unknown>;
  astVersion: number;
  engineVersion: number;
  createdAt: string;
  updatedAt: string;
}

export const ScriptSourceFormats = ['json'] as const;

export type ScriptSourceFormat = typeof ScriptSourceFormats[number];

export type ScriptSourceDto = {
  format: ScriptSourceFormat;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ScriptVersionDto = {
  id: string;
  name?: string;
  content: ScriptContentDto;
  source: ScriptSourceDto;
  versionNumber: number;
  status: ScriptVersionStatus;
  createdAt: string;
  updatedAt: string;
}

export type ScriptVersionSnapshotDto = {
  name?: string;
  status: ScriptVersionStatus;
  versionNumber: number;
  createdAt: string;
  updatedAt: string;
  content: ScriptContentDto;
  source: ScriptSourceDto;
}

export type GetScriptVersionsProviderParams = {
  page?: number;
  limit?: number;
  filter?: {
    status: ScriptVersionStatus;
    format?: ScriptSourceFormat;
    engineVersion?: number;
  };
  sort?: {
    field?: 'versionNumber' | 'status' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
  };
}

export type GetScriptVersionsProvider = (scriptId: string, params?: GetScriptVersionsProviderParams) => DataSource<Paginated<ScriptVersionDto>>
export type GetScriptVersionProvider = (scriptId: string, scriptVersionId: string) => DataSource<ScriptVersionDto>