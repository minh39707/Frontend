import { simulateRequest } from '@/services/api';
import { EmailAuthPayload, OnboardingData } from '@/src/types/onboarding';

export async function saveHabitToServer(data: OnboardingData) {
  return simulateRequest(
    {
      success: true,
      syncedAt: new Date().toISOString(),
      data,
    },
    850
  );
}

export async function signInWithGoogle() {
  return simulateRequest(
    {
      id: 'google-user-1',
      name: 'Avery Parker',
      email: 'avery@example.com',
      provider: 'google',
    },
    900
  );
}

export async function signUpWithEmail(payload: EmailAuthPayload) {
  return simulateRequest(
    {
      id: 'email-user-1',
      name: payload.fullName,
      email: payload.email,
      provider: 'email',
    },
    950
  );
}
