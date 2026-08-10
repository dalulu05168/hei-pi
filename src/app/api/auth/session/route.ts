import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/services/auth/session";
import type { SessionUser } from "@/types";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const response = NextResponse.json({ user: null }, { status: 401 });

    if (token) {
      response.cookies.set(SESSION_COOKIE_NAME, "", {
        ...getSessionCookieOptions(),
        maxAge: 0,
      });
    }

    return response;
  }

  const user: SessionUser = {
    user_id: session.user_id,
    username: session.username,
    role: session.role,
    status: session.status,
  };
  return NextResponse.json({ user });
}
