import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

function StatProgressBar({ color, current, displayValue, label, max }) {
  const safeMax = max > 0 ? max : current || 1;
  const ratio = Math.max(0, Math.min(current / safeMax, 1));
  const resolvedValue = displayValue ?? (max ? `${current}/${max}` : `${current}`);

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel} variant="caption">
        {label}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { backgroundColor: color, width: `${Math.max(ratio * 100, 8)}%` }]} />
      </View>
      <Text style={styles.barValue} variant="caption">
        {resolvedValue}
      </Text>
    </View>
  );
}

export default function UserStatsCard({ score, name, stats }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Text style={styles.scoreText} variant="title">
              {score}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.nameText} variant="body">
          {name}
        </Text>

        <View style={styles.barList}>
          {stats.map((stat) => (
            <StatProgressBar
              color={stat.color}
              current={stat.current}
              displayValue={stat.displayValue}
              key={stat.label}
              label={stat.label}
              max={stat.max}
            />
          ))}
        </View>
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
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 84,
    height: 84,
    borderRadius: radii.pill,
    backgroundColor: '#5A70FF',
    padding: 7,
  },
  ringInner: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 29,
    lineHeight: 32,
    color: '#0F172A',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 9,
    paddingRight: 4,
  },
  nameText: {
    color: '#0F172A',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  barList: {
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 42,
    color: '#0F172A',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  barValue: {
    minWidth: 46,
    color: '#475569',
    textAlign: 'right',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: '#E4EAF4',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
