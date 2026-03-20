import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { colors } from '@/constants/colors';
import { useOnboarding } from '@/src/store/OnboardingContext';

export default function IndexScreen() {
  const { completed, hydrated } = useOnboarding();

  if (!hydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={completed ? '/(tabs)' : '/welcome'} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
