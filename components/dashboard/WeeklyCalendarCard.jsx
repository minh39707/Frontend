import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

function getStatusIcon(status) {
  if (status === 'completed') {
    return { backgroundColor: colors.successSoft, color: colors.successDeep, name: 'checkmark' };
  }

  if (status === 'warning') {
    return { backgroundColor: colors.warningSoft, color: colors.warningDeep, name: 'alert' };
  }

  if (status === 'active') {
    return { backgroundColor: 'rgba(255,255,255,0.18)', color: colors.surface, name: 'time' };
  }

  return { backgroundColor: '#E5E7EB', color: colors.neutral, name: 'remove' };
}

export default function WeeklyCalendarCard({ weeklyStatus }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} variant="subtitle">
          {weeklyStatus.monthLabel}
        </Text>

        <View style={styles.todayPill}>
          <Text style={styles.todayText} variant="label">
            {weeklyStatus.todayLabel}
          </Text>
        </View>
      </View>

      <View style={styles.daysRow}>
        {weeklyStatus.days.map((day) => {
          const icon = getStatusIcon(day.status);
          const isActive = day.status === 'active';
          const isCompleted = day.status === 'completed';
          const isWarning = day.status === 'warning';
          const isIdle = day.status === 'idle';

          return (
            <View
              key={day.id}
              style={[
                styles.dayCard,
                isIdle && styles.dayCardIdle,
                isCompleted && styles.dayCardCompleted,
                isWarning && styles.dayCardWarning,
                isActive && styles.dayCardActive,
              ]}>
              <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]} variant="caption">
                {day.label}
              </Text>
              <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]} variant="subtitle">
                {day.date}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: icon.backgroundColor }]}>
                <Ionicons color={icon.color} name={icon.name} size={icon.name === 'remove' ? 18 : 20} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
  },
  todayPill: {
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#DCE5FF',
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  dayCardIdle: {
    backgroundColor: colors.neutralSoft,
    borderColor: '#E5E7EB',
  },
  dayCardCompleted: {
    backgroundColor: '#F7FFF9',
    borderColor: '#CBEFD7',
  },
  dayCardWarning: {
    backgroundColor: '#FFFBF1',
    borderColor: '#F8E0A4',
  },
  dayCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dayLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dayLabelActive: {
    color: colors.surface,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 26,
  },
  dayNumberActive: {
    color: colors.surface,
  },
  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
