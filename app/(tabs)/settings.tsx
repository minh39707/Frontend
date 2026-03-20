import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeInDown.duration(450)} style={styles.content}>
        <Text variant="title">Cai dat</Text>
        <Card style={styles.card}>
          <Text variant="subtitle">Ca nhan hoa</Text>
          <Text variant="body" color="muted">
            Tai day ban co the them thong bao, muc tieu ngay va che do dong bo tai khoan.
          </Text>
        </Card>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    gap: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
