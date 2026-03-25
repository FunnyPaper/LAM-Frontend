import type { CreateScriptProvider } from 'lam-frontend/api/commands/script/create.script.provider';
import type { RemoveScriptProvider } from 'lam-frontend/api/commands/script/remove.script.provider';
import type { UpdateScriptProvider } from 'lam-frontend/api/commands/script/update.script.provider';
import type { GetScriptSchemaProvider } from 'lam-frontend/api/queries/script-schema.provider';
import type { GetScriptProvider, GetScriptsProvider, ScriptDto } from 'lam-frontend/api/queries/script.provider';
import { create } from 'zustand';
import { z } from 'zod';
import dummySchema from './dummy.schema.json' with { type: 'json' };
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';

type ScriptState = {
  state: ScriptDto[];
  getOne: GetScriptProvider;
  getAll: GetScriptsProvider;
  create: CreateScriptProvider;
  remove: RemoveScriptProvider;
  update: UpdateScriptProvider;
  getJsonSchema: GetScriptSchemaProvider;
};

export const scriptStore = create<ScriptState>((set, store) => ({
  state: [
    {
      id: '1',
      name: 'script1',
      description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
  ],
  getOne: (id: string) => {
    const listeners: ((data: ScriptDto) => void)[] = [];
    const find = () => store().state.find((s) => s.id == id)!;

    return {
      subscribe: (listener) => {
        listeners.push(listener);
        listener(find());

        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
      invalidate: async () => {
        listeners.forEach((l) => l(find()));
      },
    };
  },
  getAll: (params) => {
    const listeners: ((data: Paginated<ScriptDto>) => void)[] = [];
    const findAll = (state: ScriptState) => {
      const filtered: ScriptDto[] = state.state
        .filter((s) => !params?.filter?.name || s.name.includes(params.filter.name))
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
  create: async (data) => {
    set((state) => {
      const copy = state.state.slice();
      const dto: ScriptDto = {
        ...data,
        id: `${Math.random() * 1000}`,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      copy.push(dto);
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
  update: async (id, data) => {
    set((state) => {
      const copy = state.state.slice();
      const match = copy.find((s) => s.id == id);
      if (match) {
        Object.assign(match, data);
      }
      return { ...state, state: copy };
    });
  },
  getJsonSchema: (version: string) => {
    const listeners: ((data: z.core.JSONSchema.JSONSchema) => void)[] = [];
    const find = () => dummySchema as unknown as z.core.JSONSchema.JSONSchema;

    return {
      subscribe: (listener) => {
        listeners.push(listener);
        listener(find());

        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
      invalidate: async () => {
        listeners.forEach((l) => l(find()));
      },
    };
  },
}));
