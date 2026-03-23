import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import QuickTaskCard from '@/components/dashboard/QuickTaskCard';

export default function QuickTaskGrid({ tasks }) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title} variant="subtitle">
          Quick tasks
        </Text>
        <Text color="muted" style={styles.count} variant="caption">
          {tasks.length} muc
        </Text>
      </View>

      <View style={styles.grid}>
        {tasks.map((task) => (
          <QuickTaskCard key={task.id} task={task} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 22,
  },
  count: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.textSoft,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
});
