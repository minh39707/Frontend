import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import DailyProgressCard from '@/components/dashboard/DailyProgressCard';
import HabitSection from '@/components/dashboard/HabitSection';
import QuickTaskGrid from '@/components/dashboard/QuickTaskGrid';
import UserStatsCard from '@/components/dashboard/UserStatsCard';
import WeeklyCalendarCard from '@/components/dashboard/WeeklyCalendarCard';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import ScreenContainer from '@/src/components/ScreenContainer';
import { useAuth } from '@/src/store/AuthContext';
import { fadeInDown } from '@/src/utils/reanimated';

export default function HomeScreen() {
  const { hydrated } = useAuth();

  if (!hydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const userName = 'H\u1ea3i Nam';
  const focusHabit = 'Thi\u1ec1n 10 ph\u00fat';
  const focusTime = '07:00 AM';
  const lifeAreaLabel = 'Mind & Mood';

  const dashboardData = {
    userStats: {
      score: 0,
      name: userName,
      stats: [
        { label: 'M\u00e1u', current: 100, max: 100, color: '#FF5B6D', displayValue: '100/100' },
        { label: 'EXP', current: 100, max: 100, color: '#4F6CF7', displayValue: '100/100' },
        { label: 'Chu\u1ed7i', current: 100, max: 100, color: '#FFCA3A', displayValue: '100' },
      ],
    },
    progressToday: {
      progress: 0.75,
      label: 't\u1ed5ng ti\u1ebfn \u0111\u1ed9',
      title: 'Ho\u00e0n th\u00e0nh h\u00f4m nay',
      subtitle: 'duy tr\u00ec 1 th\u00f3i quen n\u1eefa \u0111\u1ec3 l\u00ean Lv',
    },
    quickTasks: [
      { id: 'water', title: 'Uong nuoc', value: '0/8 ly', metric: '2L', icon: 'water-outline' },
      { id: 'meditate', title: 'Thien', value: '5 phut', metric: '5m', icon: 'leaf-outline' },
      { id: 'run', title: 'Chay bo', value: '0/10 km', metric: '10', icon: 'walk-outline' },
      { id: 'read', title: 'Doc sach', value: '0/10 trang', metric: '10', icon: 'book-outline' },
    ],
    weeklyStatus: {
      monthLabel: 'Thang 3',
      todayLabel: 'Hom nay',
      days: [
        { id: 'mon', label: 'T2', date: '17', status: 'completed' },
        { id: 'tue', label: 'T3', date: '18', status: 'completed' },
        { id: 'wed', label: 'T4', date: '19', status: 'warning' },
        { id: 'thu', label: 'T5', date: '20', status: 'completed' },
        { id: 'fri', label: 'T6', date: '21', status: 'active' },
        { id: 'sat', label: 'T7', date: '22', status: 'idle' },
        { id: 'sun', label: 'CN', date: '23', status: 'idle' },
      ],
    },
    goodHabits: [
      {
        id: 'good-focus',
        title: focusHabit,
        subtitle: `${focusTime} - ${lifeAreaLabel}`,
        icon: 'sparkles-outline',
        actionLabel: 'Xong',
        actionVariant: 'done',
      },
      {
        id: 'good-water',
        title: 'Uong 2L nuoc',
        subtitle: 'Hoan thanh 8/10 ly hom nay',
        icon: 'water-outline',
        actionLabel: 'Xong',
        actionVariant: 'done',
      },
      {
        id: 'good-run',
        title: 'Chay bo 20 phut',
        subtitle: 'Bat dau sau 18:00',
        icon: 'walk-outline',
        actionLabel: 'Dem gio',
        actionVariant: 'timer',
      },
    ],
    badHabits: [
      {
        id: 'bad-social',
        title: 'Luot mang xa hoi qua lau',
        subtitle: 'Gioi han trong 30 phut',
        icon: 'phone-portrait-outline',
        actionLabel: 'Thanh cong',
        actionVariant: 'success',
      },
      {
        id: 'bad-late',
        title: 'Thuc khuya sau 23:00',
        subtitle: 'Giu lich ngu on dinh toi nay',
        icon: 'moon-outline',
        actionLabel: 'Thanh cong',
        actionVariant: 'success',
      },
    ],
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <Animated.View entering={fadeInDown(360)} style={styles.section}>
        <UserStatsCard {...dashboardData.userStats} />
      </Animated.View>

      <Animated.View entering={fadeInDown(420, 40)} style={styles.section}>
        <DailyProgressCard progressToday={dashboardData.progressToday} />
      </Animated.View>

      <Animated.View entering={fadeInDown(480, 80)} style={styles.section}>
        <QuickTaskGrid tasks={dashboardData.quickTasks} />
      </Animated.View>

      <Animated.View entering={fadeInDown(540, 120)} style={styles.section}>
        <WeeklyCalendarCard weeklyStatus={dashboardData.weeklyStatus} />
      </Animated.View>

      <Animated.View entering={fadeInDown(600, 160)} style={styles.section}>
        <HabitSection items={dashboardData.goodHabits} title="THOI QUEN TOT" tone="good" />
      </Animated.View>

      <Animated.View entering={fadeInDown(660, 200)} style={styles.section}>
        <HabitSection items={dashboardData.badHabits} title="THOI QUEN XAU CAN BO" tone="bad" />
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 176,
  },
  section: {
    gap: spacing.sm,
  },
});
