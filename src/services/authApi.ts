import { simulateRequest } from '@/services/api';
import { EmailAuthPayload, EmailSignInPayload } from '@/src/types/auth';

function getDisplayNameFromEmail(email: string) {
  const localPart = email.split('@')[0]?.trim();

  if (!localPart) {
    return 'Habit Hero';
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ');
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

export async function signInWithEmail(payload: EmailSignInPayload) {
  return simulateRequest(
    {
      id: 'email-user-1',
      name: getDisplayNameFromEmail(payload.email),
      email: payload.email,
      provider: 'email',
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
