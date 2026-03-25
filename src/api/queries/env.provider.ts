import type { DataSource } from "../resources/datasource";
import type { Paginated } from "./paginated.provider";

export type EnvDto = {
  id: string,
  name: string,
  description?: string,
  data?: Record<string, string | undefined>
  createdAt?: string;
  updatedAt?: string;
}

export type EnvSnapshotDto = {
  name: string;
  description?: string;
  data?: Record<string, string | undefined>;
}

export type GetEnsProviderParams = {
  page?: number;
  limit?: number;
  filter?: {
    name?: string;
  };
  sort?: {
    field?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
  };
}

export type GetEnvsProvider = (params?: GetEnsProviderParams) => DataSource<Paginated<EnvDto>>
export type GetEnvProvider = (id: string) => DataSource<EnvDto>
