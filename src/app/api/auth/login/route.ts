import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, formatUser } from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { success, error } from "@/lib/api/response";
import { setAuthCookie } from "@/lib/api/cookies";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return error("Email and password are required");
    }
    if (!/^[a-zA-Z@.]+$/.test(email) || email.length > 20) {
      return error("Invalid email format");
    }
    if (password.length !== 5) {
      return error("Invalid password format");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await verifyPassword(password, user.password))) {
      return error("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = success({ user: formatUser(user), token });
    return setAuthCookie(res, token);
  } catch (err) {
    console.error("Login error:", err);
    return error("Login failed", 500);
  }
}
