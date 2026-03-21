export type LifeArea =
  | 'health_fitness'
  | 'mind_mood'
  | 'career_study'
  | 'home_organization'
  | 'finances'
  | 'relationships'
  | 'creativity_hobbies';

export type HabitType = 'preset' | 'custom';

export type FrequencyType = 'everyday' | 'weekdays' | 'weekends' | 'specific_days';

export type TimePeriod = 'morning' | 'afternoon' | 'evening';

export type SpecificDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type AuthMethod = 'guest' | 'google' | 'email' | null;

export interface UserProfile {
  name: string;
  email: string;
  provider: Exclude<AuthMethod, 'guest' | null>;
}

export interface OnboardingData {
  life_area: LifeArea | null;
  life_area_label: string | null;
  habit_name: string | null;
  habit_type: HabitType | null;
  time_period: TimePeriod;
  time_exact: string;
  frequency: FrequencyType;
  specific_days: SpecificDay[];
}

export interface PersistedOnboardingState {
  data: OnboardingData;
  onboardingCompleted: boolean;
  completed: boolean;
  authMethod: AuthMethod;
  userProfile: UserProfile | null;
  hasCustomTime: boolean;
  lastUpdatedAt: string | null;
}

export interface LifeAreaOption {
  label: string;
  value: LifeArea;
  description: string;
  icon: string;
}

export interface EducationItem {
  title: string;
  description: string;
  icon: string;
}

export interface HabitOption {
  label: string;
  value: string;
  description: string;
  icon: string;
}

export interface FrequencyOption {
  label: string;
  value: FrequencyType;
  description: string;
}

export interface TimePeriodOption {
  label: string;
  value: TimePeriod;
  description: string;
  icon: string;
}

export interface DayOption {
  label: string;
  short: string;
  value: SpecificDay;
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
