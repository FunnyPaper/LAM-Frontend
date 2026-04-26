import type { CreateEnvProvider } from 'lam-frontend/api/commands/env/create.env.provider';
import type { RemoveEnvProvider } from 'lam-frontend/api/commands/env/remove.env.provider';
import type { UpdateEnvProvider } from 'lam-frontend/api/commands/env/update.env.provider';
import type { EnvDto, GetEnvProvider, GetEnvsProvider } from 'lam-frontend/api/queries/env.provider';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import { create } from 'zustand';

type EnvStoreState = {
  state: EnvDto[];
  getOne: GetEnvProvider;
  getAll: GetEnvsProvider;
  create: CreateEnvProvider;
  update: UpdateEnvProvider;
  remove: RemoveEnvProvider;
};

export const envStore = create<EnvStoreState>((set, store) => ({
  state: [
    {
      id: '1',
      name: 'env1111111111111111111111111111111112222222222222222222222222222222222',
      description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pharetra efficitur vehicula. Curabitur et arcu eget nibh ornare venenatis. Morbi vitae massa feugiat, pharetra nibh at, mattis ante. Vivamus facilisis turpis ut nulla sodales, id tempus eros finibus. Cras tristique nisl et maximus consequat. Nulla lacinia, justo vitae commodo sagittis, est orci placerat lorem, at laoreet lacus ex at quam. Ut sem nisi, ullamcorper id mi eget, bibendum semper mauris. Sed lacinia urna eu neque fermentum gravida.

Nullam quis ipsum ultricies nibh ornare lacinia. Nulla nisi libero, bibendum ac diam eu, feugiat pretium dolor. Quisque congue, nisl sed hendrerit tincidunt, mauris mi imperdiet leo, vitae scelerisque lorem nulla ut quam. Quisque hendrerit tempor bibendum. Quisque consequat neque sed tellus euismod, sed gravida erat semper. Etiam auctor mattis imperdiet. Cras tincidunt dictum ipsum fringilla consectetur. Quisque porta arcu nec arcu tempus, at lobortis neque facilisis. Phasellus in elit pharetra, congue turpis quis, ultrices lacus.
            `,
      data: { fieldA: 'A' },
    },
    {
      id: '2',
      name: 'env2',
      data: { fieldB: 'B' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: `${i + 3}`,
      name: 'env2',
      data: { fieldB: 'B' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    })),
  ],
  getOne: (id) => {
    const listeners: ((data: EnvDto) => void)[] = [];
    const find = () => store().state.find((env) => env.id == id)!;

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
    const listeners: ((data: Paginated<EnvDto>) => void)[] = [];
    const findAll = () => {
      const filtered = store()
        .state.filter((env) => !params?.filter?.name || env.name.includes(params.filter.name))
        .sort((a, b) => {
          if (!params?.sort?.field) return 0;

          const order: number =
            (b[params.sort.field] && a[params.sort.field]?.localeCompare(b[params.sort.field]!)) || 0;
          return params.sort.order == 'desc' ? order * -1 : order;
        });

      const totalPages = filtered.length % (params?.limit ?? 10);

      return {
        data: filtered,
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
  create: async (data) =>
    set((state) => {
      state.state = [...state.state, { id: (Math.random() * 1000).toFixed(), ...data }];
      return state;
    }),
  update: async (id, data) =>
    set((state) => {
      const obj = state.state.find((s) => s.id == id)!;
      Object.assign(obj, data);
      return state;
    }),
  remove: async (data) =>
    set((state) => {
      state.state.splice(
        state.state.findIndex((s) => s.id === data),
        1
      );
      return state;
    }),
}));
