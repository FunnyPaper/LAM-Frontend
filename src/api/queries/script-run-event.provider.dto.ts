import type { DataSource } from "../resources/datasource";
import type { ScriptRunStatus } from "./script-run.provider.dto";

export const ScriptRunEventTypes = ['status', 'resultUpdate', 'log'] as const;

export type ScriptRunEventDto = {
  type: 'status',
  status: ScriptRunStatus
} | {
  type: 'resultUpdate',
  change: {
    type: 'partial' | 'full',
    data: Record<string, unknown>
  }
} | {
  type: 'log',
  log: {
    type: 'info' | 'warn' | 'error',
    message: string
  }
}

export type GetScriptRunEventProvider = (id: string) => DataSource<ScriptRunEventDto>
