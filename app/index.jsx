import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuth } from '@/src/store/AuthContext';
export default function IndexScreen() {
    const { hydrated, isAuthenticated, onboardingCompleted } = useAuth();
    if (!hydrated) {
        return (<View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large"/>
      </View>);
    }
    if (isAuthenticated) {
        return <Redirect href="/(tabs)"/>;
    }
    if (!onboardingCompleted) {
        return <Redirect href="/onboarding"/>;
    }
    return <Redirect href="/sign-in"/>;
}
const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});
