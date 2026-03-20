import * as Haptics from 'expo-haptics';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SecondaryButton({ label, onPress, style }: Props) {
  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <Pressable accessibilityRole="button" onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Text variant="label" color="primary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
});
