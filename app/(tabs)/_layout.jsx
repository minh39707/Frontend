import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import AssistantChat from '@/components/layout/AssistantChat';
import BottomTab from '@/components/layout/BottomTab';
import { colors } from '@/constants/colors';
import { useAuth } from '@/src/store/AuthContext';
export default function TabLayout() {
    const { hydrated, isAuthenticated, onboardingCompleted } = useAuth();
    if (!hydrated) {
        return (<View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large"/>
      </View>);
    }
    if (!isAuthenticated) {
        if (!onboardingCompleted) {
            return <Redirect href="/onboarding"/>;
        }
        return <Redirect href="/sign-in"/>;
    }
    return (<>
      <Tabs tabBar={(props) => <BottomTab {...props}/>} screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }}/>
        <Tabs.Screen name="analytics" options={{ title: 'Phan tich' }}/>
        <Tabs.Screen name="store" options={{ title: 'Cua hang' }}/>
        <Tabs.Screen name="settings" options={{ title: 'Cai dat' }}/>
      </Tabs>
      <AssistantChat />
    </>);
}
const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});
