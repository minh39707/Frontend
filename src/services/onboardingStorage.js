import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = 'habit-app:onboarding-state';

export async function loadOnboardingState() {
  const rawValue = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue);
}

export async function saveOnboardingState(state) {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export async function clearOnboardingState() {
  await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
