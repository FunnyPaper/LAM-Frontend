export type RegisterDto = {
  username: string;
  password: string;
};

export type RegisterAuthProvider = (data: RegisterDto) => Promise<void>;
