import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { fadeInDown } from '@/src/utils/reanimated';
export default function StoreScreen() {
    return (<View style={styles.screen}>
      <Animated.View entering={fadeInDown(450)} style={styles.content}>
        <Text variant="title">Cua hang</Text>
        <Card style={styles.card}>
          <Text variant="subtitle">Vat pham thuong</Text>
          <Text variant="body" color="muted">
            Ban co the them skin, booster va vat pham doi diem trong man hinh nay.
          </Text>
        </Card>
      </Animated.View>
    </View>);
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
