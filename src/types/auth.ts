export type UserRole = "admin" | "user";

export type UserStatus = "active" | "inactive";

export interface User {
  user_id: string;
  username: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export type SessionUser = Omit<User, "password">;

export interface SessionPayload extends SessionUser {
  expires_at: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthResult {
  message?: string;
  success: boolean;
}
