export type LoginDto = {
  username: string;
  password: string;
};

export type LoginAuthProvider = (data: LoginDto) => Promise<void>;
