import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

function getButtonConfig(variant) {
  if (variant === 'timer') {
    return {
      backgroundColor: colors.surfaceBlue,
      borderColor: '#DCE5FF',
      iconColor: colors.primary,
      iconName: 'time-outline',
      textColor: colors.primaryDeep,
    };
  }

  if (variant === 'success') {
    return {
      backgroundColor: colors.successSoft,
      borderColor: colors.successSoft,
      iconColor: colors.successDeep,
      iconName: 'checkmark-circle',
      textColor: colors.successDeep,
    };
  }

  return {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    iconColor: colors.surface,
    iconName: 'checkmark',
    textColor: colors.surface,
    elevated: true,
  };
}

export default function HabitItem({ item, tone = 'good' }) {
  const buttonConfig = getButtonConfig(item.actionVariant);
  const iconBackground = tone === 'good' ? colors.primarySoft : colors.dangerSoft;
  const iconColor = tone === 'good' ? colors.primary : colors.danger;

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Ionicons color={iconColor} name={item.icon} size={20} />
      </View>

      <View style={styles.copyWrap}>
        <Text style={styles.title} variant="label">
          {item.title}
        </Text>
        <Text color="muted" numberOfLines={1} style={styles.subtitle} variant="caption">
          {item.subtitle}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          void Haptics.selectionAsync();
        }}
      style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: buttonConfig.backgroundColor,
            borderColor: buttonConfig.borderColor,
          },
          buttonConfig.elevated && styles.actionButtonElevated,
          pressed && styles.actionButtonPressed,
        ]}>
        <Ionicons color={buttonConfig.iconColor} name={buttonConfig.iconName} size={16} />
        <Text style={{ color: buttonConfig.textColor }} variant="label">
          {item.actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.soft,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  copyWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  subtitle: {
    lineHeight: 19,
    color: colors.textSoft,
  },
  actionButton: {
    minWidth: 100,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonElevated: {
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  actionButtonPressed: {
    opacity: 0.92,
  },
});
