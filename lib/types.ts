export type userSession = {
  id: number;
  role: "Admin" | "User";
};

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export type userRedis = {
  success: boolean;
  data: { id: number; role: string };
} | null;

export type User = {
  createdAt: Date;
  email: string;
  name: string | null;
  id: number;
  password: string;
  role: "Admin" | "User";
  salt: string;
  updatedAt: Date;
};
