import type { ScriptRunResource } from 'lam-frontend/api/resources/script-run.resource';
import { scriptRunStore } from './scriptRunStore';

export function useScriptRunResourceHook(): ScriptRunResource {
  const {
    getOne: getOneScriptRun,
    getAll: getAllScriptRuns,
    cancel: cancelScriptRun,
    create: createScriptRun,
    reexecute: reexecuteScriptRun,
    remove: removeScriptRun,
  } = scriptRunStore();

  return {
    getOne: getOneScriptRun,
    getAll: getAllScriptRuns,
    cancel: cancelScriptRun,
    create: createScriptRun,
    reexecute: reexecuteScriptRun,
    remove: removeScriptRun,
  };
}
