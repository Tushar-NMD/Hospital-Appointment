import { success } from "@/lib/api/response";
import { clearAuthCookie } from "@/lib/api/cookies";

export async function POST() {
  const res = success({ message: "Logged out" });
  return clearAuthCookie(res);
}
