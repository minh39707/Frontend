import { createContext, useContext, useEffect, useState } from 'react';

import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/src/services/authApi';
import { clearAuthState, loadAuthState, saveAuthState } from '@/src/services/authStorage';

const AUTH_STATE_VERSION = 1;

const initialPersistedState = {
  version: AUTH_STATE_VERSION,
  onboardingCompleted: false,
  completed: false,
  authMethod: null,
  userProfile: null,
  lastUpdatedAt: null,
};

function normalizePersistedState(persistedState) {
  if (!persistedState || persistedState.version !== AUTH_STATE_VERSION) {
    return initialPersistedState;
  }

  return {
    ...initialPersistedState,
    ...persistedState,
    version: AUTH_STATE_VERSION,
    onboardingCompleted: Boolean(persistedState?.onboardingCompleted),
    completed: Boolean(persistedState?.completed),
    authMethod: persistedState?.authMethod ?? null,
    userProfile: persistedState?.userProfile ?? null,
    lastUpdatedAt: persistedState?.lastUpdatedAt ?? null,
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [persistedState, setPersistedState] = useState(initialPersistedState);
  const [hydrated, setHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const savedState = await loadAuthState();

        if (isMounted) {
          setPersistedState(normalizePersistedState(savedState));
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to hydrate auth state', error);
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

    void saveAuthState({
      ...persistedState,
      lastUpdatedAt: new Date().toISOString(),
    });
  }, [hydrated, persistedState]);

  const updateState = (updater) => {
    setPersistedState((current) => updater(current));
  };

  const authenticate = async (payload) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      let profile;

      if (payload.method === 'google') {
        const response = await signInWithGoogle();
        profile = {
          name: response.name,
          email: response.email,
          provider: 'google',
        };
      } else if (payload.mode === 'signUp') {
        const response = await signUpWithEmail(payload.payload);
        profile = {
          name: response.name,
          email: response.email,
          provider: 'email',
        };
      } else {
        const response = await signInWithEmail(payload.payload);
        profile = {
          name: response.name,
          email: response.email,
          provider: 'email',
        };
      }

      updateState((current) => ({
        ...current,
        completed: true,
        authMethod: payload.method,
        userProfile: profile,
      }));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Something went wrong while signing you in.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const completeOnboarding = () => {
    updateState((current) => ({
      ...current,
      onboardingCompleted: true,
    }));
  };

  const resetAppState = async () => {
    setSaveError(null);
    await clearAuthState();
    setPersistedState(initialPersistedState);
  };

  const value = {
    hydrated,
    onboardingCompleted: persistedState.onboardingCompleted,
    isAuthenticated: persistedState.completed,
    authMethod: persistedState.authMethod,
    userProfile: persistedState.userProfile,
    isSaving,
    saveError,
    authenticate,
    completeOnboarding,
    resetAppState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
