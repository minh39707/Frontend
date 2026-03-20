import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { radii } from '@/constants/theme';

type Props = {
  progress: number;
};

export default function ProgressBar({ progress }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.max(0, Math.min(progress, 1)),
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth],
  });

  return (
    <View onLayout={handleLayout} style={styles.track}>
      <Animated.View style={[styles.fill, { width: animatedWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
});
