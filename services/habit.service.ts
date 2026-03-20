import { colors } from '@/constants/colors';
import { simulateRequest } from '@/services/api';
import { getUserStats, ResourceStat } from '@/services/user.service';

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  color: string;
  tintColor: string;
  icon: 'run' | 'water' | 'meditate' | 'read';
};

export type CalendarDay = {
  label: string;
  date: number;
  status: 'done' | 'warning' | 'empty';
  isSelected?: boolean;
};

export type HabitSummary = {
  id: string;
  title: string;
  progressLabel: string;
  actionLabel: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
  actionTone: 'warning' | 'primary' | 'success' | 'neutral';
};

export type DashboardData = {
  todayProgress: number;
  monthLabel: string;
  stats: ResourceStat[];
  quickActions: QuickAction[];
  calendarDays: CalendarDay[];
  goodHabits: HabitSummary[];
  badHabits: HabitSummary[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const stats = await getUserStats();

  return simulateRequest({
    todayProgress: 0.75,
    monthLabel: 'Thang 3, 2026',
    stats,
    quickActions: [
      { id: 'water', title: 'Uong nuoc', description: '0/8', color: colors.primary, tintColor: '#EDF5FF', icon: 'water' },
      { id: 'meditate', title: 'Thien', description: '5 phut', color: colors.success, tintColor: '#ECFDF5', icon: 'meditate' },
      { id: 'run', title: 'Chay', description: '0/1km', color: '#F59E0B', tintColor: '#FFF6E7', icon: 'run' },
      { id: 'read', title: 'Doc sach', description: '0/10 trang', color: colors.purple, tintColor: '#F6F1FF', icon: 'read' },
    ],
    calendarDays: [
      { label: 'Mon', date: 16, status: 'done' },
      { label: 'Tue', date: 17, status: 'warning' },
      { label: 'Wed', date: 18, status: 'done' },
      { label: 'Thu', date: 19, status: 'done' },
      { label: 'Fri', date: 20, status: 'warning', isSelected: true },
      { label: 'Sat', date: 21, status: 'empty' },
      { label: 'Sun', date: 22, status: 'empty' },
    ],
    goodHabits: [
      {
        id: 'read',
        title: 'Doc sach',
        progressLabel: '0/30 phut',
        actionLabel: 'Dem gio',
        icon: 'book',
        iconColor: colors.purple,
        iconBackground: '#F5EEFF',
        actionTone: 'warning',
      },
      {
        id: 'workout',
        title: 'Tap the duc',
        progressLabel: '0/1 lan',
        actionLabel: 'Xong',
        icon: 'barbell',
        iconColor: colors.primary,
        iconBackground: '#EEF5FF',
        actionTone: 'primary',
      },
      {
        id: 'drink',
        title: 'Uong nuoc',
        progressLabel: '3/8 ly',
        actionLabel: 'Xong',
        icon: 'water',
        iconColor: '#10B981',
        iconBackground: '#E9FAF3',
        actionTone: 'success',
      },
    ],
    badHabits: [
      {
        id: 'smoke',
        title: 'Hut thuoc',
        progressLabel: 'Ngung: 1d 2h 30m',
        actionLabel: 'Thanh cong',
        icon: 'remove-circle',
        iconColor: '#F43F5E',
        iconBackground: '#FFF1F2',
        actionTone: 'neutral',
      },
      {
        id: 'social',
        title: 'Luot MXH qua muc',
        progressLabel: 'Ngung: 0d 5h 12m',
        actionLabel: 'Thanh cong',
        icon: 'phone-portrait',
        iconColor: '#F43F5E',
        iconBackground: '#FFF1F2',
        actionTone: 'neutral',
      },
    ],
  });
}
