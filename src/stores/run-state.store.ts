import { create } from 'zustand';
import type { ScriptRunEventDto } from '../api/queries/script-run-event.provider.dto';
import type { ScriptRunResultDto, ScriptRunStatus } from '../api/queries/script-run.provider.dto';

type Updater<T> = T | ((prev: T) => T);

interface RunState {
  currentStatus: ScriptRunStatus;
  scriptRunEvents: ScriptRunEventDto[];
  resultData: ScriptRunResultDto | null;
  updateStatus: (status: Updater<ScriptRunStatus>) => void;
  addEvent: (event: ScriptRunEventDto) => void;
  updateResult: (result: Updater<ScriptRunResultDto | null>) => void;
  reset: () => void;
}

export const useRunState = create<RunState>((set) => ({
  currentStatus: 'Unknown' as ScriptRunStatus,
  scriptRunEvents: [],
  resultData: null,
  updateStatus: (status) =>
    set((state) => ({
      currentStatus: typeof status === 'function' ? status(state.currentStatus) : status,
    })),
  addEvent: (event) =>
    set((state) => ({
      scriptRunEvents: [...state.scriptRunEvents, event],
    })),
  updateResult: (result) =>
    set((state) => ({
      resultData: typeof result === 'function' ? result(state.resultData) : result,
    })),
  reset: () =>
    set({
      currentStatus: 'Unknown',
      scriptRunEvents: [],
      resultData: null,
    }),
}));
