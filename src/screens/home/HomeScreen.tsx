import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import EmptyStateCard from '@/src/components/EmptyStateCard';
import HabitPreviewCard from '@/src/components/HabitPreviewCard';
import PrimaryButton from '@/src/components/PrimaryButton';
import ScreenContainer from '@/src/components/ScreenContainer';
import SecondaryButton from '@/src/components/SecondaryButton';
import { useOnboarding } from '@/src/store/OnboardingContext';
import { formatTimeLabel, getFrequencyLabel, getHabitDisplayName, getLifeAreaLabel } from '@/src/utils/onboarding';

export default function HomeScreen() {
  const router = useRouter();
  const { authMethod, completed, data, hydrated, resetOnboarding } = useOnboarding();

  if (!hydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!completed) {
    return (
      <ScreenContainer contentContainerStyle={styles.emptyWrap}>
        <EmptyStateCard
          actionLabel="Start onboarding"
          description="You have not finished setting up your first habit yet."
          onAction={() => router.replace('/welcome')}
          title="Welcome to your dashboard"
        />
      </ScreenContainer>
    );
  }

  const habitLabel = getHabitDisplayName(data.habit_name, data.habit_type);
  const scheduleLabel = `${data.time_period[0].toUpperCase()}${data.time_period.slice(1)} at ${formatTimeLabel(data.time_exact)}`;
  const frequencyLabel = getFrequencyLabel(data.frequency, data.specific_days);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
        <Text variant="title">Welcome back</Text>
        <Text variant="body" color="muted">
          Your onboarding is complete and your first habit is ready to go.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(470).delay(40)}>
        <HabitPreviewCard frequencyLabel={frequencyLabel} habitLabel={habitLabel} timeLabel={scheduleLabel} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(520).delay(80)} style={styles.grid}>
        <Card style={styles.infoCard}>
          <Text variant="caption" color="muted">
            Life area
          </Text>
          <Text variant="subtitle">{getLifeAreaLabel(data.life_area)}</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text variant="caption" color="muted">
            Save mode
          </Text>
          <Text variant="subtitle">
            {authMethod === 'guest' ? 'Guest mode' : authMethod === 'google' ? 'Google sync' : 'Email account'}
          </Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(560).delay(120)} style={styles.summaryCard}>
        <Card style={styles.summaryInner}>
          <Text variant="subtitle">{"Today's setup"}</Text>
          <Text variant="body" color="muted">
            Stay focused on one realistic habit and let consistency do the heavy lifting.
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text variant="label" color="primary">
                {scheduleLabel}
              </Text>
            </View>
            <View style={styles.summaryPill}>
              <Text variant="label" color="primary">
                {frequencyLabel}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton label="Adjust my habit" onPress={() => router.replace('/schedule')} />
        <SecondaryButton
          label="Start over"
          onPress={() => {
            void resetOnboarding();
            router.replace('/welcome');
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    justifyContent: 'center',
  },
  content: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  grid: {
    gap: spacing.sm,
  },
  infoCard: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryCard: {
    marginTop: spacing.xs,
  },
  summaryInner: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
