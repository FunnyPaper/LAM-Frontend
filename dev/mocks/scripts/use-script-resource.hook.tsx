import type { ScriptResource } from 'lam-frontend/api/resources/script.resource';
import { scriptStore } from './scriptStore';

export function useScriptResourceHook(): ScriptResource {
  const {
    getOne: getOneScript,
    getAll: getAllScripts,
    create: createScript,
    remove: removeScript,
    update: updateScript,
    getJsonSchema,
  } = scriptStore();

  return {
    getOne: getOneScript,
    getAll: getAllScripts,
    create: createScript,
    remove: removeScript,
    update: updateScript,
    getJsonSchema: getJsonSchema,
  };
}
