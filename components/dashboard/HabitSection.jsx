import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import HabitItem from '@/components/dashboard/HabitItem';

export default function HabitSection({ items, title, tone }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title} variant="label">
        {title}
      </Text>

      <View style={styles.list}>
        {items.map((item) => (
          <HabitItem item={item} key={item.id} tone={tone} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  title: {
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  list: {
    gap: spacing.md,
  },
});
