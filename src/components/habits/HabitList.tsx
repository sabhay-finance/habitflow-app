import React from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import type { Habit, StreakInfo } from '../../types';
import { HabitCard } from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  streakMap: Map<string, StreakInfo>;
  onToggle: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenFreezeModal: (habit: Habit) => void;
  onReorder: (newOrder: Habit[]) => void;
  isDraggable?: boolean;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  streakMap,
  onToggle,
  onEdit,
  onDelete,
  onOpenFreezeModal,
  onReorder,
  isDraggable = true,
}) => {
  return (
    <Reorder.Group
      axis="y"
      values={habits}
      onReorder={onReorder}
      className="space-y-3 w-full"
    >
      <AnimatePresence initial={false}>
        {habits.map((habit) => {
          const streakInfo: StreakInfo = streakMap.get(habit.id) || {
            currentStreak: 0,
            longestStreak: 0,
            isCompletedToday: false,
            isFrozenToday: false,
            totalCompletions: 0,
            completionRateLast30Days: 0,
          };

          return (
            <Reorder.Item
              key={habit.id}
              value={habit}
              dragListener={isDraggable}
              className="list-none"
            >
              <HabitCard
                habit={habit}
                streakInfo={streakInfo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenFreezeModal={onOpenFreezeModal}
                showDragHandle={isDraggable}
              />
            </Reorder.Item>
          );
        })}
      </AnimatePresence>
    </Reorder.Group>
  );
};
