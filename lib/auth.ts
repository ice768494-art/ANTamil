
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "ant_admin";

function secret() {
  const value = process.env.SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters"
    );
  }

  return new TextEncoder().encode(value);
}

export async function createSession() {
  const token = await new SignJWT({
    role: "admin"
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();

  jar.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function isAdmin() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;

  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret());

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(cookieName);
}
