import type { DataSource } from "../resources/datasource";
import type { EnvSnapshotDto } from "./env.provider";
import type { Paginated } from "./paginated.provider";
import type { ScriptVersionSnapshotDto } from "./script-version.provider";

export const ScriptRunStatuses = ['Unknown', 'Queued', 'Running', 'Succeeded', 'Failed', 'Cancelled'] as const;

export type ScriptRunStatus = typeof ScriptRunStatuses[number];

export type ScriptRunResultDto = {
  data?: Record<string, unknown>
  createdAt?: string;
  updatedAt?: string;
}

export type ScriptRunDto = {
  id: string,
  status: ScriptRunStatus;
  scriptVersionSnapshot: ScriptVersionSnapshotDto;
  envSnapshot: EnvSnapshotDto;
  result: ScriptRunResultDto;
  createdAt?: string;
  updatedAt?: string;
  finishedAt?: string;
}

export type GetScriptRunsProviderParams = {
  page?: number;
  limit?: number;
  filter?: {
    status?: ScriptRunStatus;
  };
  sort?: {
    field?: 'status' | 'createdAt' | 'updatedAt' | 'finishedAt';
    order?: 'asc' | 'desc';
  };
}

export type GetScriptRunsProvider = (params?: GetScriptRunsProviderParams) => DataSource<Paginated<ScriptRunDto>>
export type GetScriptRunProvider = (id: string) => DataSource<ScriptRunDto>