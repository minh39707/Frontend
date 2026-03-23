import AsyncStorage from '@react-native-async-storage/async-storage';

import { PersistedAuthState } from '@/src/types/auth';

const AUTH_STORAGE_KEY = 'habit-app:auth-state';

export async function loadAuthState() {
  const rawValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as PersistedAuthState;
}

export async function saveAuthState(state: PersistedAuthState) {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export async function clearAuthState() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}
