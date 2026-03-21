import { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_ONBOARDING_DATA } from '@/src/constants/onboarding';
import { saveHabitToServer, signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/src/services/onboardingApi';
import { loadOnboardingState, saveOnboardingState } from '@/src/services/onboardingStorage';
import { getDefaultTimeForPeriod, isOnboardingReadyForSave } from '@/src/utils/onboarding';
const initialPersistedState = {
    data: INITIAL_ONBOARDING_DATA,
    onboardingCompleted: false,
    completed: false,
    authMethod: null,
    userProfile: null,
    hasCustomTime: false,
    lastUpdatedAt: null,
};
function normalizePersistedState(persistedState) {
    return {
        ...initialPersistedState,
        ...persistedState,
        data: {
            ...INITIAL_ONBOARDING_DATA,
            ...(persistedState?.data ?? {}),
        },
        onboardingCompleted: persistedState?.onboardingCompleted ?? persistedState?.completed ?? false,
        completed: persistedState?.completed ?? false,
        authMethod: persistedState?.authMethod ?? null,
        userProfile: persistedState?.userProfile ?? null,
        hasCustomTime: persistedState?.hasCustomTime ?? false,
        lastUpdatedAt: persistedState?.lastUpdatedAt ?? null,
    };
}
const OnboardingContext = createContext(null);
export function OnboardingProvider({ children }) {
    const [persistedState, setPersistedState] = useState(initialPersistedState);
    const [hydrated, setHydrated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const hydrate = async () => {
            try {
                const savedState = await loadOnboardingState();
                if (savedState && isMounted) {
                    setPersistedState(normalizePersistedState(savedState));
                }
            }
            catch (error) {
                if (__DEV__) {
                    console.warn('Failed to hydrate onboarding state', error);
                }
            }
            finally {
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
    const updateData = (updater) => {
        setPersistedState((current) => updater(current));
    };
    const setLifeArea = (option) => {
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
    const setHabitSelection = (habitName, habitType) => {
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
    const setTimePeriod = (period) => {
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
    const setTimeExact = (time) => {
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
    const setFrequency = (frequency) => {
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
    const toggleSpecificDay = (day) => {
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
    const completeGettingStarted = () => {
        setSaveError(null);
        updateData((current) => ({
            ...current,
            onboardingCompleted: true,
        }));
    };
    const authenticate = async (payload) => {
        setIsSaving(true);
        setSaveError(null);
        try {
            if (!persistedState.onboardingCompleted && !isOnboardingReadyForSave(persistedState.data.habit_name)) {
                throw new Error('Please complete Getting Started before logging in.');
            }
            let profile;
            if (payload.method === 'google') {
                const response = await signInWithGoogle();
                profile = {
                    name: response.name,
                    email: response.email,
                    provider: 'google',
                };
            }
            else if (payload.mode === 'signUp') {
                const response = await signUpWithEmail(payload.payload);
                profile = {
                    name: response.name,
                    email: response.email,
                    provider: 'email',
                };
            }
            else {
                const response = await signInWithEmail(payload.payload);
                profile = {
                    name: response.name,
                    email: response.email,
                    provider: 'email',
                };
            }
            if (isOnboardingReadyForSave(persistedState.data.habit_name)) {
                await saveHabitToServer(persistedState.data);
            }
            updateData((current) => ({
                ...current,
                onboardingCompleted: current.onboardingCompleted || isOnboardingReadyForSave(current.data.habit_name),
                completed: true,
                authMethod: payload.method,
                userProfile: profile,
            }));
        }
        catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Something went wrong while signing you in.');
            throw error;
        }
        finally {
            setIsSaving(false);
        }
    };
    const resetOnboarding = async () => {
        setPersistedState(initialPersistedState);
        setSaveError(null);
    };
    const value = {
        data: persistedState.data,
        hydrated,
        onboardingCompleted: persistedState.onboardingCompleted,
        completed: persistedState.completed,
        authMethod: persistedState.authMethod,
        userProfile: persistedState.userProfile,
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
        completeGettingStarted,
        authenticate,
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
