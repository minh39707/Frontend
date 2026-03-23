import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/theme';
import AuthField from '@/src/components/auth/AuthField';
import AuthPrimaryButton from '@/src/components/auth/AuthPrimaryButton';
import AuthScreenFrame, { authPalette } from '@/src/components/auth/AuthScreenFrame';
import AuthSocialSection from '@/src/components/auth/AuthSocialSection';
import { useAuth } from '@/src/store/AuthContext';
import { fadeInDown } from '@/src/utils/reanimated';

export default function SignInScreen() {
  const router = useRouter();
  const { authenticate, isSaving, saveError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);

    try {
      await authenticate({
        method: 'email',
        mode: 'signIn',
        payload: {
          email: email.trim(),
          password,
        },
      });
      router.replace('/(tabs)');
    } catch {
      return;
    }
  };

  const handleSocialSignIn = async (provider) => {
    if (provider !== 'google') {
      setError(`${provider[0].toUpperCase()}${provider.slice(1)} sign in will be added next. Use Google or email for now.`);
      return;
    }

    setError(null);

    try {
      await authenticate({ method: 'google' });
      router.replace('/(tabs)');
    } catch {
      return;
    }
  };

  return (
    <AuthScreenFrame subtitle="Login now" title="Welcome to HabitForge">
      <Animated.View entering={fadeInDown(470, 30)} style={styles.form}>
        <AuthField
          autoCapitalize="none"
          autoComplete="email"
          icon="mail-outline"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="hello@habitforge.app"
          value={email}
        />
        <AuthField
          autoComplete="password"
          icon="lock-closed-outline"
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
      </Animated.View>

      <Animated.View entering={fadeInDown(510, 60)} style={styles.actionBlock}>
        {error || saveError ? (
          <Text variant="body" style={styles.errorText}>
            {error ?? saveError}
          </Text>
        ) : null}

        <AuthPrimaryButton label="Login" loading={isSaving} onPress={() => void handleEmailSignIn()} />
        <AuthSocialSection onPress={(provider) => void handleSocialSignIn(provider)} />
      </Animated.View>

      <Animated.View entering={fadeInDown(560, 90)} style={styles.footer}>
        <Text style={styles.footerText} variant="body">
          Don&apos;t have an account?
        </Text>
        <Pressable onPress={() => router.push('/sign-up')}>
          <Text style={styles.footerLink} variant="body">
            Sign Up
          </Text>
        </Pressable>
      </Animated.View>
    </AuthScreenFrame>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  errorText: {
    color: '#D64545',
    textAlign: 'center',
  },
  actionBlock: {
    gap: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: authPalette.muted,
  },
  footerLink: {
    color: authPalette.accent,
    fontWeight: '700',
  },
});
