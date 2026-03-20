import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/theme';

type Props = {
  title: string;
  actionLabel?: string;
  children: ReactNode;
};

export default function Section({ title, actionLabel, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="caption" color="muted" style={styles.title}>
          {title}
        </Text>
        {actionLabel ? <Button label={actionLabel} variant="ghost" /> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
});
