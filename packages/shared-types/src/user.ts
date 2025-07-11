/**
 * User-related types for Supabase authentication and user profile management
 */

/**
 * User preferences that can be customized by the user
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  currency: string;
  dateFormat: string;
  dashboardLayout?: string;
}

/**
 * User Profile - stored in our custom user_profiles table
 * References Supabase auth.users.id as the foreign key
 */
export interface UserProfile {
  id: string; // References auth.users.id
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Combined user data with auth info from Supabase and profile from our DB
 */
export interface AppUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: Date;
  lastSignInAt?: Date;
  profile?: UserProfile;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}

export interface UserProfileResponse {
  id: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface AppUserResponse {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: string;
  lastSignInAt?: string;
  profile: UserProfileResponse;
}
