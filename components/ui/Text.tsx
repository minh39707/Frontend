import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text as RNText, TextStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/theme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';
type TextColor = 'default' | 'muted' | 'primary' | 'white';

type Props = {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

const variantStyles: Record<TextVariant, TextStyle> = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', fontFamily: fonts?.display },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '700', fontFamily: fonts?.display },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500', fontFamily: fonts?.text },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', fontFamily: fonts?.text },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600', fontFamily: fonts?.rounded },
};

const colorStyles: Record<TextColor, TextStyle> = {
  default: { color: colors.text },
  muted: { color: colors.textMuted },
  primary: { color: colors.primary },
  white: { color: colors.surface },
};

export function Text({
  children,
  variant = 'body',
  color = 'default',
  style,
  numberOfLines,
}: Props) {
  return (
    <RNText numberOfLines={numberOfLines} style={[styles.base, variantStyles[variant], colorStyles[color], style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default Text;
