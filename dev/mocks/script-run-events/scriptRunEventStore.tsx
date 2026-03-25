import type {
  GetScriptRunEventProvider,
  ScriptRunEventDto,
} from 'lam-frontend/api/queries/script-run-event.provider.dto';
import { create } from 'zustand';

type ScriptRunEventState = {
  state: ScriptRunEventDto[];
  start: GetScriptRunEventProvider;
};

export const scriptRunEventStore = create<ScriptRunEventState>((set) => ({
  state: Array.from({ length: 100 })
    .flatMap<ScriptRunEventDto>(() => [
      {
        type: 'log',
        log: {
          type: 'warn',
          message: 'This is a test run.',
        },
      },
      {
        type: 'status',
        status: 'Running',
      },
      {
        type: 'resultUpdate',
        change: {
          type: 'partial',
          data: {
            [`field${Math.random() * 100}`]: JSON.stringify({
              url: `field${Math.random() * 100}`,
              age: Math.random(),
            }),
          },
        },
      },
      {
        type: 'log',
        log: {
          type: 'error',
          message: 'This is a test run',
        },
      },
    ])
    .concat(
      {
        type: 'status',
        status: 'Succeeded',
      },
      {
        type: 'resultUpdate',
        change: {
          type: 'full',
          data: {
            field1: JSON.stringify({ url: 'field1', age: Math.random() }),
            field2: JSON.stringify({ url: 'field2', age: Math.random() }),
          },
        },
      }
    ),
  start: () => {
    let intervalId: ReturnType<typeof setInterval>;

    return {
      subscribe: (listener) => {
        set((state) => {
          const copy = state.state.slice();
          intervalId = setInterval(() => {
            if (copy.length == 0) {
              clearInterval(intervalId);
              return;
            }

            listener(copy.shift()!);
          }, 100);

          return state;
        });

        return () => {
          clearInterval(intervalId);
        };
      },
      invalidate: async () => {
        clearInterval(intervalId);
      },
    };
  },
}));
