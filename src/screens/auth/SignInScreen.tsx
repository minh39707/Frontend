import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import PrimaryButton from '@/src/components/PrimaryButton';
import ScreenContainer from '@/src/components/ScreenContainer';
import SecondaryButton from '@/src/components/SecondaryButton';
import { signInWithGoogle } from '@/src/services/onboardingApi';
import { useOnboarding } from '@/src/store/OnboardingContext';

export default function SignInScreen() {
  const router = useRouter();
  const { completed } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.replace(completed ? '/(tabs)' : '/life-area');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content} scroll={false}>
      <Animated.View entering={FadeInDown.duration(430)} style={styles.top}>
        <View style={styles.iconWrap}>
          <Ionicons color={colors.primary} name="log-in-outline" size={28} />
        </View>
        <View style={styles.copyWrap}>
          <Text variant="title">Sign in</Text>
          <Text variant="body" color="muted">
            This placeholder screen is ready to connect to a real authentication flow later.
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(480).delay(40)} style={styles.middle}>
        <Card style={styles.card}>
          <Text variant="subtitle">Quick access</Text>
          <Text variant="body" color="muted">
            Continue with Google for a mock sign-in, or use email to open the sign-up placeholder.
          </Text>
        </Card>

        {error ? (
          <Text variant="body" style={styles.errorText}>
            {error}
          </Text>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(520).delay(80)} style={styles.actions}>
        <PrimaryButton
          icon={<Ionicons color={colors.surface} name="logo-google" size={18} />}
          label="Continue with Google"
          loading={loading}
          onPress={() => void handleGoogleSignIn()}
        />
        <PrimaryButton
          icon={<Ionicons color={colors.surface} name="mail-outline" size={18} />}
          label="Continue with email"
          onPress={() => router.push('/sign-up?source=auth')}
          style={styles.emailButton}
        />
        <SecondaryButton label="Back to welcome" onPress={() => router.replace('/welcome')} />
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
  top: {
    gap: spacing.lg,
    paddingTop: spacing.xxl,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    gap: spacing.sm,
  },
  middle: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  emailButton: {
    backgroundColor: colors.text,
  },
  errorText: {
    color: colors.danger,
  },
});
