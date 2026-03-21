import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { radii, shadows } from '@/constants/theme';
export default function Card({ children, style }) {
    return <View style={[styles.card, style]}>{children}</View>;
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radii.xl,
        ...shadows.card,
    },
});
