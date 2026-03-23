import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

export default function QuickTaskCard({ task }) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
      }}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.copyWrap}>
        <Text numberOfLines={1} style={styles.title} variant="label">
          {task.title}
        </Text>
        <Text numberOfLines={1} style={styles.value} variant="caption">
          {task.value}
        </Text>
      </View>

      <Ionicons color={colors.primaryDeep} name={task.icon} size={32} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 92,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  copyWrap: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
    color: colors.text,
    fontWeight: '700',
  },
  value: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  },
  icon: {
    flexShrink: 0,
  },
});
