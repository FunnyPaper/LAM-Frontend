import type { DataSource } from "../resources/datasource";
import { z } from 'zod';

export type GetScriptSchemaProvider = (
  version: string
) => DataSource<z.core.JSONSchema.JSONSchema>;