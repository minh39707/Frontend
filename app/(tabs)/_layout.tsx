import { Tabs } from 'expo-router';

import AssistantChat from '@/components/layout/AssistantChat';
import BottomTab from '@/components/layout/BottomTab';

export default function TabLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <BottomTab {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="analytics" options={{ title: 'Phan tich' }} />
        <Tabs.Screen name="store" options={{ title: 'Cua hang' }} />
        <Tabs.Screen name="settings" options={{ title: 'Cai dat' }} />
      </Tabs>
      <AssistantChat />
    </>
  );
}
