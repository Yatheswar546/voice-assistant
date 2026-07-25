import axios from "axios";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?:string
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData) {
  const response = await axios.post<ApiResponse<AuthUser>>(
    "/api/auth/register",
    data
  );

  return response.data;
}

/**
 * Login user
 */
export async function login(data: LoginData) {
  const response = await axios.post<ApiResponse<AuthUser>>(
    "/api/auth/login",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

/**
 * Get currently authenticated user
 */
export async function getCurrentUser() {
  const response = await axios.get<ApiResponse<AuthUser>>(
    "/api/auth/me",
    {
      withCredentials: true,
    }
  );

  return response.data;
}

/**
 * Logout user
 */
export async function logout() {
  const response = await axios.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
}