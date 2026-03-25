import type { UserDto } from "lam-frontend/api/queries/user.provider";

export type UpdateUserDto = Partial<UserDto>
export type UpdateUserProvider = (data: UpdateUserDto) => Promise<void>