import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import BackHeader from '@/src/components/BackHeader';
import EmptyStateCard from '@/src/components/EmptyStateCard';
import HabitPreviewCard from '@/src/components/HabitPreviewCard';
import PrimaryButton from '@/src/components/PrimaryButton';
import ScreenContainer from '@/src/components/ScreenContainer';
import SecondaryButton from '@/src/components/SecondaryButton';
import { ONBOARDING_COPY, ONBOARDING_TOTAL_STEPS } from '@/src/constants/onboarding';
import { useOnboarding } from '@/src/store/OnboardingContext';
import {
  formatTimeLabel,
  getFrequencyLabel,
  getHabitDisplayName,
  isOnboardingReadyForSave,
} from '@/src/utils/onboarding';

export default function SaveProgressScreen() {
  const router = useRouter();
  const { clearSaveError, completeOnboarding, data, isSaving, saveError } = useOnboarding();

  if (!isOnboardingReadyForSave(data.habit_name)) {
    return (
      <ScreenContainer contentContainerStyle={styles.fallbackContent}>
        <EmptyStateCard
          actionLabel="Finish schedule"
          description="There is no habit ready to save yet, so this final step needs your schedule first."
          onAction={() => router.replace('/schedule')}
          title="Schedule your habit first"
        />
      </ScreenContainer>
    );
  }

  const habitLabel = getHabitDisplayName(data.habit_name, data.habit_type);
  const timeLabel = `${data.time_period[0].toUpperCase()}${data.time_period.slice(1)} at ${formatTimeLabel(data.time_exact)}`;
  const frequencyLabel = getFrequencyLabel(data.frequency, data.specific_days);

  const handleComplete = async (method: 'guest' | 'google') => {
    clearSaveError();

    try {
      await completeOnboarding(method);
      router.replace('/(tabs)');
    } catch {
      return;
    }
  };

  return (
    <ScreenContainer>
      <BackHeader onBack={() => router.back()} step={5} totalSteps={ONBOARDING_TOTAL_STEPS} />

      <Animated.View entering={FadeInDown.duration(420)} style={styles.illustration}>
        <View style={styles.illustrationOuter}>
          <View style={styles.illustrationMiddle}>
            <View style={styles.illustrationInner}>
              <Ionicons color={colors.primary} name="cloud-upload-outline" size={40} />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(470).delay(30)} style={styles.header}>
        <Text variant="title">{ONBOARDING_COPY.saveTitle}</Text>
        <Text variant="body" color="muted">
          {ONBOARDING_COPY.saveDescription}
        </Text>
      </Animated.View>

      <HabitPreviewCard frequencyLabel={frequencyLabel} habitLabel={habitLabel} timeLabel={timeLabel} />

      {saveError ? (
        <Text variant="body" style={styles.errorText}>
          {saveError}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton
          icon={<Ionicons color={colors.surface} name="logo-google" size={18} />}
          label="Continue with Google"
          loading={isSaving}
          onPress={() => void handleComplete('google')}
        />
        <PrimaryButton
          icon={<Ionicons color={colors.surface} name="mail-outline" size={18} />}
          label="Continue with email"
          onPress={() => router.push('/sign-up?source=onboarding')}
          style={styles.emailButton}
        />
        <SecondaryButton label="Continue as guest" onPress={() => void handleComplete('guest')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fallbackContent: {
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  illustrationOuter: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationMiddle: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: '#D9EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  emailButton: {
    backgroundColor: colors.text,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
  },
});
