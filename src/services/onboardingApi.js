import { apiRequest } from '@/services/api';

export async function saveHabitToServer(userId, data) {
  return apiRequest('/onboarding/sync', {
    method: 'POST',
    userId,
    body: data,
  });
}

export async function signInWithGoogle() {
  const response = await apiRequest('/auth/google', {
    method: 'POST',
    body: {},
  });

  return response.user;
}

export async function signInWithEmail(payload) {
  const response = await apiRequest('/auth/email/sign-in', {
    method: 'POST',
    body: payload,
  });

  return response.user;
}

export async function signUpWithEmail(payload) {
  const response = await apiRequest('/auth/email/sign-up', {
    method: 'POST',
    body: payload,
  });

  return response.user;
}
