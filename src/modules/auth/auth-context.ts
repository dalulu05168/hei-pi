"use client";

import { createContext } from "react";
import type {
  AuthResult,
  AuthStatus,
  LoginCredentials,
  SessionUser,
} from "@/types";

export interface AuthContextValue {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  status: AuthStatus;
  user: SessionUser | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
