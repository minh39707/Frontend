import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({ label, onPress, disabled, loading, icon, style }: Props) {
  const handlePress = () => {
    if (disabled || loading) {
      return;
    }

    void Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && !loading && styles.buttonPressed,
        style,
      ]}>
      {loading ? <ActivityIndicator color={colors.surface} /> : null}
      {!loading && icon ? <View style={styles.icon}>{icon}</View> : null}
      {!loading ? (
        <Text variant="label" color="white" style={styles.label}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    ...shadows.soft,
  },
  buttonDisabled: {
    backgroundColor: '#BFD4F6',
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
});
