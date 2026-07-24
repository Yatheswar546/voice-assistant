import bcrypt from "bcryptjs";

import { User } from "@/models/User";
import { RegisterInput } from "@/schemas/auth.schema";

/**
 * Creates a new user
 */
export async function createUser(data: RegisterInput) {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
}