import { FadeInDown, ReduceMotion } from 'react-native-reanimated';

export function fadeInDown(duration, delay = 0) {
  return FadeInDown.duration(duration).delay(delay).reduceMotion(ReduceMotion.Never);
}

export function timingConfig(duration) {
  return {
    duration,
    reduceMotion: ReduceMotion.Never,
  };
}
