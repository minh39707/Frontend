import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

function ProgressRing({ progress }) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.ringWrap}>
      <View style={styles.innerRing}>
        <Text style={styles.ringValue} variant="title">
          {Math.round(clampedProgress * 100)}%
        </Text>
      </View>
    </View>
  );
}

export default function DailyProgressCard({ progressToday }) {
  return (
    <View style={styles.card}>
      <ProgressRing progress={progressToday.progress} />

      <View style={styles.copyWrap}>
        <Text style={styles.kicker} variant="body">
          {progressToday.label}
        </Text>
        <Text style={styles.title} variant="title">
          {progressToday.title}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle} variant="body">
          {progressToday.subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3F5F9',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D7DFEB',
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  copyWrap: {
    flex: 1,
    gap: 3,
    paddingRight: 4,
  },
  kicker: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  ringWrap: {
    width: 84,
    height: 84,
    borderRadius: radii.pill,
    backgroundColor: '#5A70FF',
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    color: '#111111',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
  },
});
