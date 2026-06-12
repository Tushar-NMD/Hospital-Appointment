import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
  email: string;
  role: "patient" | "doctor";
}

export function signToken(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
