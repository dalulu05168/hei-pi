import { NextResponse } from "next/server";
import { authenticateUser } from "@/services/auth/auth-service";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/services/auth/session";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Solicitud de inicio de sesión no válida." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !body.username.trim() ||
    !body.password
  ) {
    return NextResponse.json(
      { message: "Ingresa el usuario y la contraseña." },
      { status: 400 },
    );
  }

  const user = authenticateUser({
    username: body.username,
    password: body.password,
  });

  if (!user) {
    return NextResponse.json(
      { message: "Usuario o contraseña incorrectos." },
      { status: 401 },
    );
  }

  const sessionToken = await createSessionToken(user);
  const response = NextResponse.json({ user });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    getSessionCookieOptions(),
  );

  return response;
}
