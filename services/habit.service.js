import { colors } from '@/constants/colors';
import { apiRequest } from '@/services/api';
import { loadOnboardingState } from '@/src/services/onboardingStorage';
import { getFrequencyLabel, getHabitDisplayName } from '@/src/utils/onboarding';

function buildMonthLabel() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

function buildFallbackStats(completed) {
  return [
    { label: 'HP', value: completed ? 80 : 0, max: 100, color: colors.danger, icon: 'heart' },
    { label: 'EXP', value: completed ? 35 : 0, max: 100, color: colors.primary, icon: 'flash' },
    { label: 'Streaks', value: completed ? 2 : 0, max: 7, color: colors.warning, icon: 'flame' },
  ];
}

function toDashboardIcon(habitName) {
  if (habitName === 'drink_water') {
    return 'water';
  }

  if (habitName === 'walk') {
    return 'run';
  }

  return 'read';
}

function buildCalendarDays(data) {
  const dayLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const shortLabels = {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  };
  const now = new Date();
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return dayLabels.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const isSelected = date.toDateString() === now.toDateString();

    return {
      label: shortLabels[day],
      date: date.getDate(),
      status: data?.habit_name ? (isSelected ? 'warning' : date < now ? 'done' : 'empty') : 'empty',
      isSelected,
    };
  });
}

function buildFallbackDashboard(data, completed) {
  const habitLabel = data ? getHabitDisplayName(data.habit_name, data.habit_type) : 'Your first habit';
  const frequencyLabel = data ? getFrequencyLabel(data.frequency, data.specific_days) : 'Choose a schedule';
  const stats = buildFallbackStats(completed);

  return {
    todayProgress: completed ? 0.68 : 0,
    monthLabel: buildMonthLabel(),
    stats,
    quickActions: [
      {
        id: 'primary',
        title: habitLabel,
        description: data ? `At ${data.time_exact}` : 'Ready to start',
        color: colors.primary,
        tintColor: '#EDF5FF',
        icon: toDashboardIcon(data?.habit_name ?? null),
      },
      {
        id: 'meditate',
        title: 'Mindful break',
        description: '5 min',
        color: colors.success,
        tintColor: '#ECFDF5',
        icon: 'meditate',
      },
    ],
    calendarDays: buildCalendarDays(data),
    goodHabits:
      completed && data?.habit_name
        ? [
            {
              id: data.habit_name,
              title: habitLabel,
              progressLabel: frequencyLabel,
              actionLabel: 'Ready today',
              icon: data.habit_name === 'drink_water' ? 'water' : 'book',
              iconColor: colors.primary,
              iconBackground: '#EEF5FF',
              actionTone: 'primary',
            },
          ]
        : [],
    badHabits: [],
  };
}

export async function getDashboardData() {
  const persistedState = await loadOnboardingState();
  const userProfile = persistedState?.userProfile ?? null;

  if (!userProfile?.id) {
    return buildFallbackDashboard(persistedState?.data ?? null, persistedState?.completed);
  }

  try {
    return await apiRequest('/dashboard', {
      method: 'GET',
      userId: userProfile.id,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Falling back to local dashboard data.', error);
    }

    return buildFallbackDashboard(persistedState?.data ?? null, persistedState?.completed);
  }
}
