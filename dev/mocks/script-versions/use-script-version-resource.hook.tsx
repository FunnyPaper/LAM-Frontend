import type { ScriptVersionResource } from 'lam-frontend/api/resources/script-version.resource';
import { scriptVersionStore } from './scriptVersionStore';

export function useScriptVersionResourceHook(): ScriptVersionResource {
  const {
    getOne: getOneScriptVersion,
    getAll: getAllScriptVersions,
    create: createScriptVersion,
    fork: forkScriptVersion,
    publish: publishScriptVersion,
    archive: archiveScriptVersion,
    remove: removeScriptVersion,
    update: updateScriptVersion,
  } = scriptVersionStore();

  return {
    getOne: getOneScriptVersion,
    getAll: getAllScriptVersions,
    create: createScriptVersion,
    fork: forkScriptVersion,
    publish: publishScriptVersion,
    archive: archiveScriptVersion,
    remove: removeScriptVersion,
    update: updateScriptVersion,
  };
}
