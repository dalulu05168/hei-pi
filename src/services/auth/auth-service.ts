import "server-only";

import type { LoginCredentials, SessionUser, User } from "@/types";
import { mockUsers } from "./mock-users";

function toSessionUser(user: User): SessionUser {
  return {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
    status: user.status,
  };
}

export function authenticateUser({
  password,
  username,
}: LoginCredentials): SessionUser | null {
  const normalizedUsername = username.trim().toLowerCase();
  const user = mockUsers.find(
    (candidate) =>
      candidate.username.toLowerCase() === normalizedUsername &&
      candidate.password === password,
  );

  if (!user || user.status !== "active") {
    return null;
  }

  return toSessionUser(user);
}
