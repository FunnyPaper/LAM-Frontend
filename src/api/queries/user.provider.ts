import type { DataSource } from "../resources/datasource";

export type UserDto = {
  email: string
}

export type GetMeUserProvider = () => DataSource<UserDto>
