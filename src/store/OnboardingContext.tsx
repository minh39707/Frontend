import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { INITIAL_ONBOARDING_DATA } from '@/src/constants/onboarding';
import { saveHabitToServer, signInWithGoogle, signUpWithEmail } from '@/src/services/onboardingApi';
import { loadOnboardingState, saveOnboardingState } from '@/src/services/onboardingStorage';
import {
  AuthMethod,
  EmailAuthPayload,
  FrequencyType,
  HabitType,
  LifeAreaOption,
  OnboardingData,
  PersistedOnboardingState,
  SpecificDay,
  TimePeriod,
} from '@/src/types/onboarding';
import { getDefaultTimeForPeriod } from '@/src/utils/onboarding';

type OnboardingContextValue = {
  data: OnboardingData;
  hydrated: boolean;
  completed: boolean;
  authMethod: AuthMethod;
  isSaving: boolean;
  saveError: string | null;
  hasCustomTime: boolean;
  setLifeArea: (option: LifeAreaOption) => void;
  setHabitSelection: (habitName: string, habitType: HabitType) => void;
  setTimePeriod: (period: TimePeriod) => void;
  setTimeExact: (time: string) => void;
  setFrequency: (frequency: FrequencyType) => void;
  toggleSpecificDay: (day: SpecificDay) => void;
  clearSaveError: () => void;
  completeOnboarding: (method: Exclude<AuthMethod, null>, payload?: EmailAuthPayload) => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const initialPersistedState: PersistedOnboardingState = {
  data: INITIAL_ONBOARDING_DATA,
  completed: false,
  authMethod: null,
  hasCustomTime: false,
  lastUpdatedAt: null,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [persistedState, setPersistedState] = useState<PersistedOnboardingState>(initialPersistedState);
  const [hydrated, setHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const savedState = await loadOnboardingState();

        if (savedState && isMounted) {
          setPersistedState(savedState);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to hydrate onboarding state', error);
        }
      } finally {
        if (isMounted) {
          setHydrated(true);
        }
      }
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void saveOnboardingState({
      ...persistedState,
      lastUpdatedAt: new Date().toISOString(),
    });
  }, [hydrated, persistedState]);

  const updateData = (updater: (current: PersistedOnboardingState) => PersistedOnboardingState) => {
    setPersistedState((current) => updater(current));
  };

  const setLifeArea = (option: LifeAreaOption) => {
    setSaveError(null);

    updateData((current) => ({
      ...current,
      data: {
        ...current.data,
        life_area: option.value,
        life_area_label: option.label,
      },
    }));
  };

  const setHabitSelection = (habitName: string, habitType: HabitType) => {
    setSaveError(null);

    updateData((current) => ({
      ...current,
      data: {
        ...current.data,
        habit_name: habitName,
        habit_type: habitType,
      },
    }));
  };

  const setTimePeriod = (period: TimePeriod) => {
    setSaveError(null);

    updateData((current) => ({
      ...current,
      data: {
        ...current.data,
        time_period: period,
        time_exact: current.hasCustomTime ? current.data.time_exact : getDefaultTimeForPeriod(period),
      },
    }));
  };

  const setTimeExact = (time: string) => {
    setSaveError(null);

    updateData((current) => ({
      ...current,
      hasCustomTime: true,
      data: {
        ...current.data,
        time_exact: time,
      },
    }));
  };

  const setFrequency = (frequency: FrequencyType) => {
    setSaveError(null);

    updateData((current) => ({
      ...current,
      data: {
        ...current.data,
        frequency,
        specific_days: frequency === 'specific_days' ? current.data.specific_days : [],
      },
    }));
  };

  const toggleSpecificDay = (day: SpecificDay) => {
    setSaveError(null);

    updateData((current) => {
      const exists = current.data.specific_days.includes(day);
      const specific_days = exists
        ? current.data.specific_days.filter((item) => item !== day)
        : [...current.data.specific_days, day];

      return {
        ...current,
        data: {
          ...current.data,
          specific_days,
        },
      };
    });
  };

  const clearSaveError = () => {
    setSaveError(null);
  };

  const completeOnboarding = async (method: Exclude<AuthMethod, null>, payload?: EmailAuthPayload) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      if (method === 'google') {
        await signInWithGoogle();
        await saveHabitToServer(persistedState.data);
      }

      if (method === 'email') {
        if (!payload) {
          throw new Error('Email sign-up details are required.');
        }

        await signUpWithEmail(payload);
        await saveHabitToServer(persistedState.data);
      }

      updateData((current) => ({
        ...current,
        completed: true,
        authMethod: method,
      }));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Something went wrong while saving your progress.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetOnboarding = async () => {
    setPersistedState(initialPersistedState);
    setSaveError(null);
  };

  const value: OnboardingContextValue = {
    data: persistedState.data,
    hydrated,
    completed: persistedState.completed,
    authMethod: persistedState.authMethod,
    isSaving,
    saveError,
    hasCustomTime: persistedState.hasCustomTime,
    setLifeArea,
    setHabitSelection,
    setTimePeriod,
    setTimeExact,
    setFrequency,
    toggleSpecificDay,
    clearSaveError,
    completeOnboarding,
    resetOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider.');
  }

  return context;
}
