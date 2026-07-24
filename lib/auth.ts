import jwt from "jsonwebtoken";

/**
 * Payload stored inside the JWT
 */
export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Read JWT secret from environment variables
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env.local"
  );
}

/**
 * Generate JWT for authenticated users
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify and decode JWT
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}