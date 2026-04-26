import type { UpdateUserDto, UpdateUserProvider } from 'lam-frontend/api/commands/user/update.user.provider';
import type { GetMeUserProvider, UserDto } from 'lam-frontend/api/queries/user.provider';
import { create } from 'zustand';

type UserStoreState = {
  state: UserDto;
  update: UpdateUserProvider;
  me: GetMeUserProvider;
};

export const userStore = create<UserStoreState>((set, store) => ({
  state: { username: 'User123' },
  update: async (data: UpdateUserDto) => set({ state: data as UserDto }),
  me: () => ({
    subscribe: (listener) => {
      const id = setTimeout(() => listener(store().state), 1000);

      return () => clearTimeout(id);
    },
    invalidate: async () => {},
  }),
}));
