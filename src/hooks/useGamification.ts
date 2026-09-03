import { useState, useCallback } from 'react';
import type {
  GamificationState,
  Badge,
  UnlockedBadge,
  Habit,
  CompletionLog,
  StreakFreeze,
} from '../types';
import { BADGES_CATALOG, calculateLevelFromXp } from '../constants/config';
import { StorageService } from '../services/storage';
import { SoundEngine } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { getTodayDateString, isHabitScheduledForDate } from '../utils/date';

export function useGamification(
  initialState: GamificationState,
  soundEnabled: boolean,
  hapticsEnabled: boolean
) {
  const [state, setState] = useState<GamificationState>(initialState);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    title: string;
    icon: string;
  } | null>(null);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  /**
   * Award XP and check for level progression
   */
  const awardXp = useCallback(
    (amount: number) => {
      setState((prev) => {
        const newTotalXp = Math.max(0, prev.xp + amount);
        const oldLevelInfo = calculateLevelFromXp(prev.xp);
        const newLevelInfo = calculateLevelFromXp(newTotalXp);

        const updated: GamificationState = {
          ...prev,
          xp: newTotalXp,
          level: newLevelInfo.level,
        };

        StorageService.saveGamification(updated);

        // Check if level increased
        if (newLevelInfo.level > oldLevelInfo.level) {
          setLevelUpData({
            newLevel: newLevelInfo.level,
            title: newLevelInfo.title,
            icon: newLevelInfo.icon,
          });
          SoundEngine.playFanfare(soundEnabled);
          HapticsService.celebration(hapticsEnabled);
        }

        return updated;
      });
    },
    [soundEnabled, hapticsEnabled]
  );

  /**
   * Evaluate whether any new badges should be unlocked
   */
  const evaluateBadges = useCallback(
    (
      habits: Habit[],
      logs: CompletionLog[],
      freezes: StreakFreeze[],
      maxStreak: number
    ) => {
      const today = getTodayDateString();
      const todayLogs = logs.filter((l) => l.date === today);
      const scheduledToday = habits.filter((h) =>
        isHabitScheduledForDate(h.frequency, today)
      );

      const isTodayPerfect =
        scheduledToday.length > 0 &&
        scheduledToday.every((h) => todayLogs.some((l) => l.habitId === h.id));

      const totalCompletions = logs.length;
      const freezeCount = freezes.length;
      const activeHabitsCount = habits.length;

      const unlockedIds = new Set(state.unlockedBadges.map((b) => b.badgeId));
      const newlyEarned: Badge[] = [];

      for (const badge of BADGES_CATALOG) {
        if (unlockedIds.has(badge.id)) continue;

        let shouldUnlock = false;

        switch (badge.id) {
          case 'first_spark':
            if (totalCompletions >= 1) shouldUnlock = true;
            break;
          case 'streak_3':
            if (maxStreak >= 3) shouldUnlock = true;
            break;
          case 'streak_7':
            if (maxStreak >= 7) shouldUnlock = true;
            break;
          case 'streak_14':
            if (maxStreak >= 14) shouldUnlock = true;
            break;
          case 'streak_30':
            if (maxStreak >= 30) shouldUnlock = true;
            break;
          case 'freeze_savior':
            if (freezeCount >= 1) shouldUnlock = true;
            break;
          case 'century_club':
            if (totalCompletions >= 100) shouldUnlock = true;
            break;
          case 'perfect_day':
            if (isTodayPerfect) shouldUnlock = true;
            break;
          case 'habit_architect':
            if (activeHabitsCount >= 4) shouldUnlock = true;
            break;
          default:
            break;
        }

        if (shouldUnlock) {
          newlyEarned.push(badge);
        }
      }

      if (newlyEarned.length > 0) {
        const newUnlockedList: UnlockedBadge[] = [
          ...state.unlockedBadges,
          ...newlyEarned.map((b) => ({
            badgeId: b.id,
            unlockedAt: new Date().toISOString(),
            seen: false,
          })),
        ];

        const updatedState: GamificationState = {
          ...state,
          unlockedBadges: newUnlockedList,
        };

        setState(updatedState);
        StorageService.saveGamification(updatedState);

        // Queue celebration for the first newly unlocked badge
        setNewlyUnlockedBadge(newlyEarned[0]);
        SoundEngine.playFanfare(soundEnabled);
        HapticsService.celebration(hapticsEnabled);
      }
    },
    [state, soundEnabled, hapticsEnabled]
  );

  const dismissLevelUp = () => setLevelUpData(null);
  const dismissBadgeModal = () => setNewlyUnlockedBadge(null);

  const levelInfo = calculateLevelFromXp(state.xp);

  return {
    gamification: state,
    levelInfo,
    awardXp,
    evaluateBadges,
    levelUpData,
    dismissLevelUp,
    newlyUnlockedBadge,
    dismissBadgeModal,
    setGamificationState: setState,
  };
}
