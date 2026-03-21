import { colors } from '@/constants/colors';
import { simulateRequest } from '@/services/api';

export async function getCurrentUser() {
  return simulateRequest({
    name: 'Dao Hai Nam',
    level: 0,
    levelProgress: 0,
  });
}

export async function getUserStats() {
  return simulateRequest([
    { label: 'HP', value: 0, max: 100, color: colors.danger, icon: 'heart' },
    { label: 'EXP', value: 0, max: 100, color: colors.primary, icon: 'flash' },
    { label: 'Streaks', value: 0, max: 7, color: colors.warning, icon: 'flame' },
  ]);
}
