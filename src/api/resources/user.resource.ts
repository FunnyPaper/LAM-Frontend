import type { UpdateUserProvider } from "../commands/user/update.user.provider";
import type { GetMeUserProvider } from "../queries/user.provider";

export type UserResource = {
  me: GetMeUserProvider,
  update: UpdateUserProvider
}