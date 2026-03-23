export type AuthMethod = 'google' | 'email' | null;

export interface UserProfile {
  name: string;
  email: string;
  provider: Exclude<AuthMethod, null>;
}

export interface PersistedAuthState {
  version: number;
  onboardingCompleted: boolean;
  completed: boolean;
  authMethod: AuthMethod;
  userProfile: UserProfile | null;
  lastUpdatedAt: string | null;
}

export interface EmailAuthPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface EmailSignInPayload {
  email: string;
  password: string;
}
