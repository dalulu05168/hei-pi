"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AuthResult,
  AuthStatus,
  LoginCredentials,
  SessionUser,
} from "@/types";
import { AuthContext, type AuthContextValue } from "./auth-context";

interface AuthProviderProps {
  children: React.ReactNode;
}

async function requestSession(): Promise<SessionUser | null> {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: SessionUser };
  return data.user;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const sessionUser = await requestSession();

      if (!sessionUser) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(sessionUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    void requestSession()
      .then((sessionUser) => {
        if (!isCurrent) return;

        setUser(sessionUser);
        setStatus(sessionUser ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!isCurrent) return;

        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      try {
        const response = await fetch("/api/auth/login", {
          body: JSON.stringify(credentials),
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const data = (await response.json()) as {
          message?: string;
          user?: SessionUser;
        };

        if (!response.ok || !data.user) {
          setUser(null);
          setStatus("unauthenticated");
          return {
            message: data.message ?? "No fue posible iniciar sesión.",
            success: false,
          };
        }

        setUser(data.user);
        setStatus("authenticated");
        router.replace("/dashboard");
        router.refresh();

        return { success: true };
      } catch {
        return {
          message: "No fue posible conectar con el servicio de acceso.",
          success: false,
        };
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        credentials: "same-origin",
        method: "POST",
      });
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      router.replace("/login");
      router.refresh();
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ login, logout, refreshSession, status, user }),
    [login, logout, refreshSession, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
