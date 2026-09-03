import React, { useState } from 'react';
import type { Habit, StreakInfo, HabitCategory } from '../../types';
import { HabitList } from './HabitList';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';
import { CATEGORY_METADATA } from '../../constants/config';
import { EmptyState } from '../common/EmptyState';

interface ManageHabitsViewProps {
  habits: Habit[];
  streakMap: Map<string, StreakInfo>;
  onToggle: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenFreezeModal: (habit: Habit) => void;
  onReorder: (newOrder: Habit[]) => void;
  onAddNewHabit: () => void;
  onSelectTemplate: (template: any) => void;
}

export const ManageHabitsView: React.FC<ManageHabitsViewProps> = ({
  habits,
  streakMap,
  onToggle,
  onEdit,
  onDelete,
  onOpenFreezeModal,
  onReorder,
  onAddNewHabit,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            All Habits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Drag items using the handle to customize their order.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onAddNewHabit}
          icon={<Plus className="w-4 h-4" />}
        >
          New Habit
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All ({habits.length})
          </button>
          {(Object.keys(CATEGORY_METADATA) as HabitCategory[]).map((cat) => {
            const count = habits.filter((h) => h.category === cat).length;
            if (count === 0) return null;
            const meta = CATEGORY_METADATA[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{meta.defaultEmoji}</span>
                <span>{meta.label.split(' ')[0]}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Habits List */}
      {filteredHabits.length > 0 ? (
        <HabitList
          habits={filteredHabits}
          streakMap={streakMap}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenFreezeModal={onOpenFreezeModal}
          onReorder={onReorder}
          isDraggable={selectedCategory === 'all'}
        />
      ) : habits.length === 0 ? (
        <EmptyState onAddCustom={onAddNewHabit} onSelectTemplate={onSelectTemplate} />
      ) : (
        <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          No habits found in this category.
        </div>
      )}
    </div>
  );
};
