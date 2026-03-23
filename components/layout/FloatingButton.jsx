import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/theme';
export default function FloatingButton({ onPress }) {
    const handlePress = () => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onPress) {
            onPress();
            return;
        }
        router.push('/modal');
    };
    return (<Pressable onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Ionicons name="add" size={30} color={colors.surface}/>
    </Pressable>);
}
const styles = StyleSheet.create({
    button: {
        width: 74,
        height: 74,
        borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: colors.surface,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        elevation: 14,
    },
    pressed: {
        transform: [{ scale: 0.94 }],
    },
});
