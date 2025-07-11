/**
 * Authentication types for Supabase integration
 */

import type {
  AuthError,
  AuthResponse,
  Session,
  User,
} from "@supabase/supabase-js";

/**
 * Authentication request types
 */
export interface SignUpRequest {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
    redirectTo?: string;
  };
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  redirectTo?: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  data?: Record<string, any>;
}

/**
 * Auth state and session types
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error?: AuthError;
}

export interface AuthChangeEvent {
  event:
    | "SIGNED_IN"
    | "SIGNED_OUT"
    | "TOKEN_REFRESHED"
    | "USER_UPDATED"
    | "PASSWORD_RECOVERY";
  session: Session | null;
}

/**
 * Auth context type for React applications
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ error?: AuthError }>;
}
