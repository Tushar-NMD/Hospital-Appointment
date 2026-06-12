import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "@/lib/auth/jwt";
import { error } from "@/lib/api/response";

export function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  const cookie = req.cookies.get("token")?.value;
  return cookie ?? null;
}

export function requireAuth(req: NextRequest, roles?: Array<"patient" | "doctor">) {
  const token = getToken(req);
  if (!token) return { error: error("Unauthorized", 401) };

  try {
    const payload = verifyToken(token);
    if (roles && !roles.includes(payload.role)) {
      return { error: error("Forbidden", 403) };
    }
    return { payload };
  } catch {
    return { error: error("Invalid or expired token", 401) };
  }
}

export type AuthResult =
  | { payload: JwtPayload; error?: never }
  | { error: ReturnType<typeof error>; payload?: never };
