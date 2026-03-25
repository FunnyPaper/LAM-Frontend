import type { EnvResource } from 'lam-frontend/api/resources/env.resource';
import { envStore } from './envStore';

export function useEnvResourceHook(): EnvResource {
  const {
    getOne: getOneEnv,
    getAll: getAllEnvs,
    create: createEnv,
    update: updateEnv,
    remove: removeEnv,
  } = envStore();

  return {
    getOne: getOneEnv,
    getAll: getAllEnvs,
    create: createEnv,
    update: updateEnv,
    remove: removeEnv,
  };
}
