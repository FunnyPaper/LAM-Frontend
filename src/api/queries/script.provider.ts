import type { DataSource } from "../resources/datasource";
import type { Paginated } from "./paginated.provider";

export type ScriptDto = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type GetScriptsProvider = (params?: {
  page?: number;
  limit?: number;
  filter?: {
    name?: string;
  };
  sort?: {
    field?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
  };
}) => DataSource<Paginated<ScriptDto>>
export type GetScriptProvider = (id: string) => DataSource<ScriptDto>