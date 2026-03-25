import type { CancelScriptRunProvider } from 'lam-frontend/api/commands/script-run/cancel.script-run.provider';
import type { CreateScriptRunProvider } from 'lam-frontend/api/commands/script-run/create.script-run.provider';
import type { ReexecuteScriptRunProvider } from 'lam-frontend/api/commands/script-run/reexecute.script-run.provider';
import type { RemoveScriptRunProvider } from 'lam-frontend/api/commands/script-run/remove.script-run.provider';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import type {
  GetScriptRunProvider,
  GetScriptRunsProvider,
  ScriptRunDto,
} from 'lam-frontend/api/queries/script-run.provider.dto';
import { create } from 'zustand';

type ScriptRunState = {
  state: ScriptRunDto[];
  getOne: GetScriptRunProvider;
  getAll: GetScriptRunsProvider;
  cancel: CancelScriptRunProvider;
  create: CreateScriptRunProvider;
  reexecute: ReexecuteScriptRunProvider;
  remove: RemoveScriptRunProvider;
};

export const scriptRunStore = create<ScriptRunState>((set, store) => ({
  state: [
    {
      id: '1',
      status: 'Queued',
      scriptVersionSnapshot: {
        status: 'Draft',
        versionNumber: 1,
        createdAt: '2023-01-01T00:00:00Z',
        content: {
          astJson: {},
          astVersion: 1,
          engineVersion: 1,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        source: {
          format: 'json',
          content: '{}',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      },
      envSnapshot: {
        name: 'env1',
        data: { fieldA: 'A' },
      },
      result: {
        data: {},
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      createdAt: '2023-01-01T00:00:00Z',
    },
  ],
  getOne: (id) => {
    const listeners: ((data: ScriptRunDto) => void)[] = [];
    const find = (state: ScriptRunState): ScriptRunDto => state.state.find((s) => s.id === id)!;

    return {
      subscribe: (listener) => {
        listeners.push(listener);
        listener(find(store()));

        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
      invalidate: async () => {
        listeners.forEach((l) => l(find(store())));
      },
    };
  },
  getAll: (params) => {
    const listeners: ((data: Paginated<ScriptRunDto>) => void)[] = [];
    const findAll = (state: ScriptRunState): Paginated<ScriptRunDto> => {
      const filtered: ScriptRunDto[] = state.state
        .filter((s) => !params?.filter?.status || s.status === params.filter.status)
        .sort((a, b) => {
          if (!params?.sort?.field) return 0;

          const order: number =
            (b[params.sort.field] && a[params.sort.field]?.localeCompare(b[params.sort.field]!)) || 0;
          return params.sort.order == 'desc' ? order * -1 : order;
        });

      const totalPages = filtered.length % (params?.limit ?? 10);

      const slice = filtered.slice(((params?.page ?? 1) - 1) * (params?.limit ?? 10), params?.limit ?? 10);

      return {
        data: slice,
        metadata: {
          totalItems: filtered.length,
          totalPages: totalPages,
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      };
    };

    return {
      subscribe: (listener) => {
        listeners.push(listener);
        listener(findAll(store()));

        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
      invalidate: async () => {
        listeners.forEach((l) => l(findAll(store())));
      },
    };
  },
  cancel: async (id) => {
    set((state) => {
      const copy = state.state.slice();
      const match = copy.find((s) => s.id == id);
      if (match) {
        const updated = { ...match };
        updated.status = 'Cancelled';
        copy.splice(copy.indexOf(match), 1, updated);
      }
      return { ...state, state: copy };
    });
  },
  create: async (data) => {
    set((state) => {
      const copy = state.state.slice();
      const dto: ScriptRunDto = {
        ...data,
        id: `${Math.random() * 1000}`,
        status: 'Queued',
        scriptVersionSnapshot: {
          status: 'Draft',
          versionNumber: 0,
          createdAt: '',
          content: {
            astJson: {},
            astVersion: 0,
            engineVersion: 0,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          source: {
            format: 'json',
            content: '{}',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        },
        envSnapshot: {
          name: 'test',
          description: 'test',
          data: {},
        },
        result: {
          data: {},
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      };
      copy.push(dto);
      setTimeout(() => (dto.status = 'Running'), 5000);
      return { ...state, state: copy };
    });
  },
  reexecute: async (id) => {
    set((state) => {
      const copy = state.state.slice();
      const match = copy.find((s) => s.id == id);
      if (match) {
        copy.push({
          ...match,
          status: 'Queued',
        });
      }

      return { ...state, state: copy };
    });
  },
  remove: async (id) => {
    set((state) => {
      const copy = state.state.slice();
      const index = copy.findIndex((s) => s.id == id);
      if (index >= 0) {
        copy.splice(index, 1);
      }

      return { ...state, state: copy };
    });
  },
}));
