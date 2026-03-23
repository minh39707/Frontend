import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuth } from '@/src/store/AuthContext';
export default function AuthLayout() {
    const { hydrated, isAuthenticated } = useAuth();
    if (!hydrated) {
        return (<View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large"/>
      </View>);
    }
    if (isAuthenticated) {
        return <Redirect href="/(tabs)"/>;
    }
    return (<Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
        }}/>);
}
const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});
