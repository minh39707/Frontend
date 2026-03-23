import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/src/store/AuthContext';
import { fadeInDown } from '@/src/utils/reanimated';
export default function SettingsScreen() {
    const router = useRouter();
    const { resetAppState } = useAuth();
    const handleResetAppState = async () => {
        await resetAppState();
        router.replace('/onboarding');
    };
    return (<View style={styles.screen}>
      <Animated.View entering={fadeInDown(450)} style={styles.content}>
        <Text variant="title">Cai dat</Text>
        <Card style={styles.card}>
          <Text variant="subtitle">Ca nhan hoa</Text>
          <Text variant="body" color="muted">
            Tai day ban co the them thong bao, muc tieu ngay va che do dong bo tai khoan.
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text variant="subtitle">Testing</Text>
          <Text variant="body" color="muted">
            Xoa onboarding va dang nhap da luu de quay ve man hinh bat dau.
          </Text>
          <Button label="Reset App State" onPress={() => void handleResetAppState()} style={styles.resetButton} variant="ghost"/>
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
    resetButton: {
        backgroundColor: '#FEE2E2',
    },
});
