import { useEffect, useMemo, useRef } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { fonts, radii, shadows, spacing } from '@/constants/theme';

const ITEM_HEIGHT = 44;
const SIDE_PADDING_ROWS = 2;
const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);
const PERIODS = ['AM', 'PM'];

function WheelColumn({ data, formatValue, label, onChange, selectedValue, visible }) {
  const listRef = useRef(null);

  const selectedIndex = useMemo(
    () => Math.max(0, data.findIndex((item) => item === selectedValue)),
    [data, selectedValue]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    });
  }, [selectedIndex, visible]);

  const updateValueFromOffset = (offsetY) => {
    const nextIndex = Math.max(0, Math.min(Math.round(offsetY / ITEM_HEIGHT), data.length - 1));
    onChange(data[nextIndex]);
  };

  const scrollToValue = (value) => {
    const nextIndex = Math.max(0, data.findIndex((item) => item === value));

    listRef.current?.scrollToOffset({
      offset: nextIndex * ITEM_HEIGHT,
      animated: true,
    });
    onChange(value);
  };

  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel} variant="caption">
        {label}
      </Text>

      <View style={styles.wheelViewport}>
        <View pointerEvents="none" style={styles.selectionHighlight} />
        <LinearGradient colors={['#FFFFFF', 'rgba(255,255,255,0.18)']} pointerEvents="none" style={styles.fadeTop} />
        <LinearGradient colors={['rgba(255,255,255,0.18)', '#FFFFFF']} pointerEvents="none" style={styles.fadeBottom} />

        <FlatList
          contentContainerStyle={styles.wheelContent}
          data={data}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            index,
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
          })}
          keyExtractor={(item) => `${label}-${item}`}
          onMomentumScrollEnd={(event) => updateValueFromOffset(event.nativeEvent.contentOffset.y)}
          onScrollEndDrag={(event) => updateValueFromOffset(event.nativeEvent.contentOffset.y)}
          ref={listRef}
          style={styles.wheelList}
          renderItem={({ item }) => {
            const isSelected = item === selectedValue;

            return (
              <Pressable onPress={() => scrollToValue(item)} style={styles.wheelItem}>
                <Text style={[styles.wheelItemText, isSelected && styles.wheelItemTextSelected]}>
                  {formatValue(item)}
                </Text>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={ITEM_HEIGHT}
        />
      </View>
    </View>
  );
}

export default function ReminderTimePickerModal({
  onCancel,
  onConfirm,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  selectedHour,
  selectedMinute,
  selectedPeriod,
  visible,
}) {
  return (
    <Modal animationType="slide" onRequestClose={onCancel} statusBarTranslucent transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onCancel} style={styles.backdrop} />

        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Choose reminder time</Text>
            <Text style={styles.subtitle} variant="body">
              Slide each wheel like iPhone Alarm, then confirm to save.
            </Text>
          </View>

          <View style={styles.columnsWrap}>
            <WheelColumn
              data={HOURS}
              formatValue={(value) => `${value}`}
              label="Hour"
              onChange={onHourChange}
              selectedValue={selectedHour}
              visible={visible}
            />
            <WheelColumn
              data={MINUTES}
              formatValue={(value) => `${value}`.padStart(2, '0')}
              label="Minute"
              onChange={onMinuteChange}
              selectedValue={selectedMinute}
              visible={visible}
            />
            <WheelColumn
              data={PERIODS}
              formatValue={(value) => value}
              label="Period"
              onChange={onPeriodChange}
              selectedValue={selectedPeriod}
              visible={visible}
            />
          </View>

          <View style={styles.actions}>
            <Button label="Cancel" onPress={onCancel} style={styles.actionButton} variant="secondary" />
            <Button label="Confirm" onPress={onConfirm} style={styles.actionButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg + spacing.xs,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: '#E4EDFF',
    ...shadows.card,
  },
  grabber: {
    alignSelf: 'center',
    width: 54,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: '#D6E3FA',
  },
  header: {
    gap: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    color: colors.text,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7A879C',
    maxWidth: 280,
  },
  columnsWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    gap: spacing.xs,
  },
  columnLabel: {
    textAlign: 'center',
    color: '#8A98B2',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  wheelViewport: {
    height: ITEM_HEIGHT * (SIDE_PADDING_ROWS * 2 + 1),
    borderRadius: 28,
    backgroundColor: '#F8FBFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4EDFF',
  },
  wheelContent: {
    paddingVertical: ITEM_HEIGHT * SIDE_PADDING_ROWS,
  },
  selectionHighlight: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: ITEM_HEIGHT * SIDE_PADDING_ROWS,
    height: ITEM_HEIGHT - 2,
    borderRadius: 16,
    backgroundColor: 'rgba(61, 90, 254, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(61, 90, 254, 0.24)',
    zIndex: 1,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * SIDE_PADDING_ROWS,
    zIndex: 3,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * SIDE_PADDING_ROWS,
    zIndex: 3,
  },
  wheelList: {
    zIndex: 2,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    fontSize: 18,
    lineHeight: 22,
    color: '#A8B4C8',
    fontFamily: fonts?.rounded,
    fontWeight: '600',
    opacity: 0.52,
  },
  wheelItemTextSelected: {
    color: '#17346E',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    opacity: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
