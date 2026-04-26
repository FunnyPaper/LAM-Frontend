import type { DataSource } from '../resources/datasource';

export type UserDto = {
  username: string;
};

export type GetMeUserProvider = () => DataSource<UserDto>;
