import { Platform } from 'react-native';

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
};

export const radii = {
  md: 18,
  lg: 22,
  xl: 26,
  xxl: 30,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  soft: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
};

export const fonts = Platform.select({
  ios: {
    display: 'SF Pro Display',
    text: 'SF Pro Text',
    rounded: 'SF Pro Rounded',
    mono: 'SF Mono',
  },
  android: {
    display: 'sans-serif-medium',
    text: 'sans-serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
  default: {
    display: 'System',
    text: 'System',
    rounded: 'System',
    mono: 'monospace',
  },
  web: {
    display: "Inter, 'SF Pro Display', system-ui, sans-serif",
    text: "Inter, 'SF Pro Text', system-ui, sans-serif",
    rounded: "Inter, 'SF Pro Rounded', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F4F6FA',
    tint: '#3D5AFE',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#3D5AFE',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#60A5FA',
    icon: '#CBD5E1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',
  },
};

export const Fonts = {
  sans: fonts?.text ?? 'System',
  serif: Platform.select({ ios: 'Times New Roman', default: 'serif', web: 'Georgia, serif' }) ?? 'serif',
  rounded: fonts?.rounded ?? 'System',
  mono: fonts?.mono ?? 'monospace',
};
