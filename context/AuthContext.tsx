"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  AuthUser,
  LoginData,
  RegisterData,
  getCurrentUser,
  login,
  logout,
  register,
} from "@/services/auth.client";

/* -------------------------------------------------------------------------- */
/*                              Context Interface                             */
/* -------------------------------------------------------------------------- */

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  loginUser: (data: LoginData) => Promise<void>;
  registerUser: (data: RegisterData) => Promise<void>;
  logoutUser: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/*                              Create Context                                */
/* -------------------------------------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                              Provider Props                                */
/* -------------------------------------------------------------------------- */

interface AuthProviderProps {
  children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                              Auth Provider                                 */
/* -------------------------------------------------------------------------- */

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * User is authenticated if user object exists.
   */
  const isAuthenticated = !!user;

  /**
   * Runs once when the application loads.
   * Checks whether a valid authentication cookie exists.
   */
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  /**
   * Login User
   */
  const loginUser = async (data: LoginData) => {
  try {
    setLoading(true);

    const response = await login(data);

    setUser(response.data);
  } finally {
    setLoading(false);
  }
};

  /**
   * Register User
   *
   * Note:
   * Registration DOES NOT log the user in.
   * The Login dialog should be shown after successful registration.
   */
  const registerUser = async (data: RegisterData) => {
    await register(data);
  };

  /**
   * Logout User
   */
  const logoutUser = async () => {
    await logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Custom Hook                                  */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}