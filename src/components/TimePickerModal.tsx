import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { fromTimePickerParts, toTimePickerParts } from '@/src/utils/onboarding';

type Props = {
  visible: boolean;
  initialTime: string;
  onClose: () => void;
  onConfirm: (time: string) => void;
};

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = [0, 15, 30, 45];
const MERIDIEMS: ('AM' | 'PM')[] = ['AM', 'PM'];

export default function TimePickerModal({ visible, initialTime, onClose, onConfirm }: Props) {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (!visible) {
      return;
    }

    const parts = toTimePickerParts(initialTime);
    setHour(parts.hour);
    setMinute(parts.minute);
    setMeridiem(parts.meridiem);
  }, [initialTime, visible]);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.overlay} />
      <View style={styles.modalWrap}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text variant="subtitle">Pick a reminder time</Text>
            <Text variant="body" color="muted">
              Choose a simple time you can realistically keep.
            </Text>
          </View>

          <View style={styles.group}>
            <Text variant="caption" color="muted">
              Hour
            </Text>
            <View style={styles.chipWrap}>
              {HOURS.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setHour(value)}
                  style={({ pressed }) => [styles.chip, hour === value && styles.chipSelected, pressed && styles.chipPressed]}>
                  <Text variant="label" style={[styles.chipText, hour === value && styles.chipTextSelected]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text variant="caption" color="muted">
              Minutes
            </Text>
            <View style={styles.chipWrap}>
              {MINUTES.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setMinute(value)}
                  style={({ pressed }) => [styles.chip, minute === value && styles.chipSelected, pressed && styles.chipPressed]}>
                  <Text variant="label" style={[styles.chipText, minute === value && styles.chipTextSelected]}>
                    {String(value).padStart(2, '0')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text variant="caption" color="muted">
              AM / PM
            </Text>
            <View style={styles.inlineWrap}>
              {MERIDIEMS.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setMeridiem(value)}
                  style={({ pressed }) => [styles.segment, meridiem === value && styles.segmentSelected, pressed && styles.chipPressed]}>
                  <Text variant="label" style={[styles.chipText, meridiem === value && styles.chipTextSelected]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="Use this time"
              onPress={() => onConfirm(fromTimePickerParts(hour, minute, meridiem))}
            />
            <SecondaryButton label="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  modalWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  group: {
    gap: spacing.xs,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  inlineWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    minWidth: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segment: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  actions: {
    gap: spacing.xs,
  },
});
