import type { ArchiveScriptVersionProvider } from 'lam-frontend/api/commands/script-version/archive.script-version.provider';
import type { CreateScriptVersionProvider } from 'lam-frontend/api/commands/script-version/create.script-version.provider';
import type { ForkScriptVersionProvider } from 'lam-frontend/api/commands/script-version/fork.script-version.provider';
import type { PublishScriptVersionProvider } from 'lam-frontend/api/commands/script-version/publish.script-version.provider';
import type { RemoveScriptVersionProvider } from 'lam-frontend/api/commands/script-version/remove.script-version.provider';
import type { UpdateScriptVersionProvider } from 'lam-frontend/api/commands/script-version/update.script-version.provider';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import type {
  GetScriptVersionProvider,
  GetScriptVersionsProvider,
  ScriptVersionDto,
} from 'lam-frontend/api/queries/script-version.provider';
import { create } from 'zustand';

type ScriptVersionState = {
  state: ScriptVersionDto[];
  getOne: GetScriptVersionProvider;
  getAll: GetScriptVersionsProvider;
  create: CreateScriptVersionProvider;
  fork: ForkScriptVersionProvider;
  publish: PublishScriptVersionProvider;
  archive: ArchiveScriptVersionProvider;
  remove: RemoveScriptVersionProvider;
  update: UpdateScriptVersionProvider;
};

export const scriptVersionStore = create<ScriptVersionState>((set, store) => ({
  state: [
    {
      id: '1',
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
      versionNumber: 1,
      status: 'Draft',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
  ],
  getOne: (scriptId, id) => {
    const listeners: ((data: ScriptVersionDto) => void)[] = [];
    const find = (): ScriptVersionDto => store().state.find((s) => s.id == id)!;

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
  getAll: (scriptId, params) => {
    const listeners: ((data: Paginated<ScriptVersionDto>) => void)[] = [];
    const findAll = (): Paginated<ScriptVersionDto> => {
      const filtered: ScriptVersionDto[] = store()
        .state.filter(
          (s) =>
            (!params?.filter?.engineVersion || s.content.engineVersion === params.filter.engineVersion) &&
            (!params?.filter?.format || s.source.format == params.filter.format)
        )
        .sort((a, b) => {
          if (!params?.sort?.field) return 0;

          let order = 0;

          switch (params.sort.field) {
            case 'versionNumber':
              order = a.versionNumber - b.versionNumber;
              break;
            case 'status':
              order = a.status.localeCompare(b.status);
              break;
            case 'createdAt':
              order = a.source.createdAt.localeCompare(b.createdAt);
              break;
            case 'updatedAt':
              order = a.source.updatedAt.localeCompare(b.source.updatedAt);
              break;
          }

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
        listener(findAll());

        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
      invalidate: async () => {
        listeners.forEach((l) => l(findAll()));
      },
    };
  },
  create: async (scriptId, data) => {
    set((state) => {
      const copy = state.state.slice();
      const dto: ScriptVersionDto = {
        ...data,
        id: `${Math.random() * 1000}`,
        versionNumber: 1,
        status: 'Draft',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        source: {
          ...data.source,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        content: {
          ...data.content,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      };
      copy.push(dto);

      return { ...state, state: copy };
    });

    return { id: "1" };
  },
  fork: async (scriptId, id) => {
    set((state) => {
      const copy = state.state.slice();
      const dto = copy.find((s) => s.id == id);
      if (dto) {
        copy.push({ ...dto });
      }

      return { ...state, state: copy };
    });
  },
  publish: async (scriptId, id, data) => {
    set((state) => {
      const copy = state.state.slice();
      const dto = copy.find((s) => s.id == id);
      if (dto) {
        dto.status = 'Published';
        dto.name = data.name;
      }

      return { ...state, state: copy };
    });
  },
  archive: async (scriptId, id) => {
    set((state) => {
      const copy = state.state.slice();
      const dto = copy.find((s) => s.id == id);
      if (dto) {
        dto.status = 'Archived';
      }

      return { ...state, state: copy };
    });
  },
  remove: async (scriptId, id) => {
    set((state) => {
      const copy = state.state.slice();
      const index = copy.findIndex((s) => s.id == id);
      if (index >= 0) {
        copy.splice(index, 1);
      }

      return { ...state, state: copy };
    });
  },
  update: async (scriptId, id, data) => {
    set((state) => {
      const copy = state.state.slice();
      const obj = copy.find((s) => s.id == id);
      if (obj) {
        Object.assign(obj, data);
      }
      return { ...state, state: copy };
    });
  },
}));
