import type { SessionPayload, SessionUser } from "@/types";

export const SESSION_COOKIE_NAME = "pi_web_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

const AUTH_SECRET =
  process.env.PI_AUTH_SECRET ??
  "pi-web-v2-local-auth-secret-change-before-production";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodePayload(payload: SessionPayload): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

async function getSigningKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(AUTH_SECRET),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    ...user,
    expires_at: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const encodedPayload = encodePayload(payload);
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload),
  );

  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, encodedSignature, extraSegment] = token.split(".");

  if (!encodedPayload || !encodedSignature || extraSegment) {
    return null;
  }

  try {
    const key = await getSigningKey();
    const signatureBytes = fromBase64Url(encodedSignature);
    const signatureBuffer = signatureBytes.buffer.slice(
      signatureBytes.byteOffset,
      signatureBytes.byteOffset + signatureBytes.byteLength,
    ) as ArrayBuffer;
    const signatureIsValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      new TextEncoder().encode(encodedPayload),
    );

    if (!signatureIsValid) {
      return null;
    }

    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encodedPayload)),
    ) as SessionPayload;

    if (
      typeof payload.user_id !== "string" ||
      typeof payload.username !== "string" ||
      !["admin", "user"].includes(payload.role) ||
      payload.status !== "active" ||
      typeof payload.expires_at !== "number" ||
      payload.expires_at <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
