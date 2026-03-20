import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import PrimaryButton from '@/src/components/PrimaryButton';
import ScreenContainer from '@/src/components/ScreenContainer';
import SecondaryButton from '@/src/components/SecondaryButton';
import { signUpWithEmail } from '@/src/services/onboardingApi';
import { useOnboarding } from '@/src/store/OnboardingContext';
import { isOnboardingReadyForSave } from '@/src/utils/onboarding';

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const { completeOnboarding, data, isSaving, saveError } = useOnboarding();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);

  const isOnboardingSource = params.source === 'onboarding';
  const canCompleteOnboarding = useMemo(
    () => isOnboardingSource && isOnboardingReadyForSave(data.habit_name),
    [data.habit_name, isOnboardingSource]
  );

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setInlineError('Please fill in your name, email, and password.');
      return;
    }

    setInlineError(null);

    try {
      if (canCompleteOnboarding) {
        await completeOnboarding('email', {
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        });
        router.replace('/(tabs)');
        return;
      }

      await signUpWithEmail({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/life-area');
    } catch {
      return;
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
        <Text variant="title">Create your account</Text>
        <Text variant="body" color="muted">
          {canCompleteOnboarding
            ? 'Create an account to sync your first habit and keep your progress safe.'
            : 'This placeholder sign-up form is ready to connect to a real backend.'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(470).delay(40)}>
        <Card style={styles.formCard}>
          <View style={styles.field}>
            <Text variant="caption" color="muted">
              Full name
            </Text>
            <TextInput
              onChangeText={setFullName}
              placeholder="Alex Morgan"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={fullName}
            />
          </View>

          <View style={styles.field}>
            <Text variant="caption" color="muted">
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@example.com"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.field}>
            <Text variant="caption" color="muted">
              Password
            </Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>
        </Card>
      </Animated.View>

      {inlineError ? (
        <Text variant="body" style={styles.errorText}>
          {inlineError}
        </Text>
      ) : null}

      {saveError && canCompleteOnboarding ? (
        <Text variant="body" style={styles.errorText}>
          {saveError}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton label="Create account" loading={isSaving} onPress={() => void handleSubmit()} />
        <SecondaryButton
          label={canCompleteOnboarding ? 'Back to save progress' : 'Back to sign in'}
          onPress={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  formCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
  },
  actions: {
    gap: spacing.sm,
  },
});
