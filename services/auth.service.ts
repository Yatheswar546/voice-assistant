import bcrypt from "bcryptjs";

import { User } from "@/models/User";
import { RegisterInput } from "@/schemas/auth.schema";

import { LoginInput } from "@/schemas/auth.schema";
import { generateToken } from "@/lib/auth";

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
  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: createdUser._id.toString(),
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
  };
}

/**
 * Validate a User (Login)
*/

export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
}