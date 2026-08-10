import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionPayload } from "@/types";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export async function getServerSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireServerSession(): Promise<SessionPayload> {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
