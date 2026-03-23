import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingButton from '@/components/layout/FloatingButton';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { shadows, spacing } from '@/constants/theme';
const iconMap = {
    index: { active: 'home', idle: 'home-outline' },
    analytics: { active: 'stats-chart', idle: 'stats-chart-outline' },
    store: { active: 'bag-handle', idle: 'bag-handle-outline' },
    settings: { active: 'settings', idle: 'settings-outline' },
};
export default function BottomTab({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const renderItem = (route, index) => {
        const options = descriptors[route.key]?.options;
        const label = options?.title ?? route.name;
        const focused = state.index === index;
        const onPress = () => {
            void Haptics.selectionAsync();
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
        };
        return (<Pressable key={route.key} onPress={onPress} style={({ pressed }) => [
                styles.item,
                focused && styles.itemActive,
                pressed && styles.itemPressed,
            ]}>
        <Ionicons
          name={focused ? iconMap[route.name].active : iconMap[route.name].idle}
          size={focused ? 22 : 20}
          color={focused ? colors.primary : colors.neutral}
        />
        <Text variant="caption" style={[styles.label, focused && styles.labelActive]}>
          {label}
        </Text>
      </Pressable>);
    };
    return (<View style={[styles.shell, { bottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.bar}>
        <View style={styles.group}>{state.routes.slice(0, 2).map((route, index) => renderItem(route, index))}</View>
        <View style={styles.centerSlot}/>
        <View style={styles.group}>{state.routes.slice(2).map((route, index) => renderItem(route, index + 2))}</View>
      </View>

      <View style={styles.fabWrap}>
        <FloatingButton />
      </View>
    </View>);
}
const styles = StyleSheet.create({
    shell: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.md,
        alignItems: 'center',
    },
    bar: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.card,
    },
    group: {
        flex: 1,
        flexDirection: 'row',
        gap: 6,
    },
    centerSlot: {
        width: 72,
    },
    item: {
        flex: 1,
        minHeight: 58,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 20,
    },
    itemActive: {
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: '#DBE4FF',
        transform: [{ scale: 1.04 }],
    },
    itemPressed: {
        opacity: 0.84,
    },
    label: {
        color: colors.neutral,
        fontSize: 11,
    },
    labelActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    fabWrap: {
        position: 'absolute',
        top: -30,
    },
});
