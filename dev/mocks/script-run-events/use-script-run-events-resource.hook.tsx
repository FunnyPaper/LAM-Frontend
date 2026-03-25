import type { ScriptRunEventResource } from 'lam-frontend/api/resources/script-run-event.resource';
import { scriptRunEventStore } from './scriptRunEventStore';

export function useScriptRunEventResourceHook(): ScriptRunEventResource {
  const { start: startScriptRunEvents } = scriptRunEventStore();

  return {
    getOne: startScriptRunEvents,
  };
}
