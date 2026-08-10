import "server-only";

import type { User } from "@/types";

// Local-only accounts. Replace this source with a database/auth provider before production.
export const mockUsers: readonly User[] = [
  {
    user_id: "pi-admin-001",
    username: "ZZL1122",
    password: "Zzl920512",
    role: "admin",
    status: "active",
  },
  {
    user_id: "pi-user-001",
    username: "usuario",
    password: "PiUser2026!",
    role: "user",
    status: "active",
  },
];
