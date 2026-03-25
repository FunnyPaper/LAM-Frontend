import type { UserResource } from 'lam-frontend/api/resources/user.resource';
import { userStore } from './userStore';

export function useUserResourceHook(): UserResource {
  const { update: updateUser, me } = userStore();
  return {
    me: me,
    update: updateUser,
  };
}
