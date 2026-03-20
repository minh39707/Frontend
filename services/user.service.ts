import { colors } from '@/constants/colors';
import { simulateRequest } from '@/services/api';

export type ResourceStat = {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
};

export type UserProfile = {
  name: string;
  level: number;
  levelProgress: number;
};

export async function getCurrentUser(): Promise<UserProfile> {
  return simulateRequest({
    name: 'Đào Hải Nam',
    level: 0,
    levelProgress: 0,
  });
}

export async function getUserStats(): Promise<ResourceStat[]> {
  return simulateRequest([
    { label: 'HP', value: 0, max: 100, color: colors.danger, icon: 'heart' },
    { label: 'EXP', value: 0, max: 100, color: colors.primary, icon: 'flash' },
    { label: 'Streaks', value: 0, max: 7, color: colors.warning, icon: 'flame' },
  ]);
}
