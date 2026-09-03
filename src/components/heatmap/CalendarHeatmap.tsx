import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit, CompletionLog, StreakFreeze } from '../../types';
import { getDayOfWeek, getPastDates, getFriendlyDateLabel } from '../../utils/date';
import { getColorTheme } from '../../constants/config';

interface CalendarHeatmapProps {
  habits?: Habit[];
  habit?: Habit; // If provided, shows single habit heatmap
  logs: CompletionLog[];
  freezes?: StreakFreeze[];
  daysCount?: number; // default 70 days (10 weeks)
  title?: string;
}

interface CellData {
  date: string;
  count: number;
  totalScheduled: number;
  intensity: number; // 0 to 4
  isFrozen: boolean;
  habitNames: string[];
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  habits,
  habit,
  logs,
  freezes = [],
  daysCount = 84, // 12 weeks
  title,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    cell: CellData;
    x: number;
    y: number;
  } | null>(null);

  // Generate date list aligned to weeks
  const pastDates = getPastDates(daysCount);

  // Build lookup maps
  const dateLogsMap = new Map<string, Set<string>>();
  for (const log of logs) {
    if (!dateLogsMap.has(log.date)) {
      dateLogsMap.set(log.date, new Set());
    }
    dateLogsMap.get(log.date)!.add(log.habitId);
  }

  const frozenDateSet = new Set<string>();
  for (const f of freezes) {
    if (!habit || f.habitId === habit.id) {
      frozenDateSet.add(f.date);
    }
  }

  // Active habits to consider
  const targetHabits = habit ? [habit] : (habits || []);

  // Compute grid data
  const gridCells: CellData[] = pastDates.map((dateStr) => {
    const completedSet = dateLogsMap.get(dateStr) || new Set();
    const isFrozen = frozenDateSet.has(dateStr);

    let completedCount = 0;
    const completedHabitNames: string[] = [];

    for (const h of targetHabits) {
      if (completedSet.has(h.id)) {
        completedCount++;
        completedHabitNames.push(h.name);
      }
    }

    const scheduledCount = Math.max(1, targetHabits.length);
    const ratio = completedCount / scheduledCount;

    let intensity = 0;
    if (completedCount > 0 || isFrozen) {
      if (ratio >= 0.9) intensity = 4;
      else if (ratio >= 0.6) intensity = 3;
      else if (ratio >= 0.3) intensity = 2;
      else intensity = 1;
    }

    return {
      date: dateStr,
      count: completedCount,
      totalScheduled: targetHabits.length,
      intensity,
      isFrozen,
      habitNames: completedHabitNames,
    };
  });

  // Group cells into columns of 7 days (weeks)
  const weeks: CellData[][] = [];
  let currentWeek: CellData[] = [];

  // Align the first week to Sunday/Monday
  const firstDate = gridCells[0]?.date;
  const firstDay = firstDate ? getDayOfWeek(firstDate) : 0;
  // Pad beginning of first week
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({
      date: '',
      count: 0,
      totalScheduled: 0,
      intensity: -1,
      isFrozen: false,
      habitNames: [],
    });
  }

  for (const cell of gridCells) {
    currentWeek.push(cell);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const theme = habit ? getColorTheme(habit.color) : getColorTheme('violet');

  // Intensity color styles
  const getCellColorClass = (cell: CellData) => {
    if (cell.intensity === -1 || !cell.date) return 'invisible pointer-events-none';
    if (cell.isFrozen) {
      return 'bg-cyan-400 dark:bg-cyan-500 shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-300';
    }

    if (habit) {
      // Single habit specific theme colors
      switch (cell.intensity) {
        case 4:
        case 3:
        case 2:
        case 1:
          return `bg-gradient-to-tr ${theme.gradient} text-white shadow-sm`;
        default:
          return 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80';
      }
    } else {
      // Composite heatmap
      switch (cell.intensity) {
        case 4:
          return 'bg-brand-600 dark:bg-brand-500 shadow-sm shadow-brand-500/30';
        case 3:
          return 'bg-brand-400 dark:bg-brand-600';
        case 2:
          return 'bg-brand-300 dark:bg-brand-800';
        case 1:
          return 'bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-900';
        default:
          return 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80';
      }
    }
  };

  const handleCellHover = (e: React.MouseEvent, cell: CellData) => {
    if (!cell.date) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      cell,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="w-full select-none">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
          <span className="text-xs text-slate-400">Past {Math.round(daysCount / 7)} weeks</span>
        </div>
      )}

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-1.5 min-w-max items-center">
          {/* Weekday labels */}
          <div className="flex flex-col gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 pr-1.5 text-right">
            <span className="h-3.5 leading-3.5">Sun</span>
            <span className="h-3.5 leading-3.5"></span>
            <span className="h-3.5 leading-3.5">Tue</span>
            <span className="h-3.5 leading-3.5"></span>
            <span className="h-3.5 leading-3.5">Thu</span>
            <span className="h-3.5 leading-3.5"></span>
            <span className="h-3.5 leading-3.5">Sat</span>
          </div>

          {/* Week Columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((cell, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  onMouseEnter={(e) => handleCellHover(e, cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={(e) => handleCellHover(e, cell)}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform duration-150 cursor-pointer ${
                    cell.date ? 'hover:scale-125' : ''
                  } ${getCellColorClass(cell)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 dark:text-slate-500">
        <span>Consistency Grid</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-200 dark:bg-brand-900" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-400 dark:bg-brand-700" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-600 dark:bg-brand-500" />
          <span>More</span>
        </div>
      </div>

      {/* Hover Floating Tooltip */}
      <AnimatePresence>
        {hoveredCell && hoveredCell.cell.date && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="z-50 pointer-events-none px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800 text-white text-xs shadow-xl border border-slate-700 backdrop-blur-sm whitespace-nowrap min-w-36 text-center"
          >
            <div className="font-bold text-slate-200">
              {getFriendlyDateLabel(hoveredCell.cell.date)}
            </div>
            {hoveredCell.cell.isFrozen ? (
              <div className="text-cyan-300 font-semibold flex items-center justify-center gap-1 mt-0.5">
                <span>🧊 Streak Freeze Deployed</span>
              </div>
            ) : hoveredCell.cell.count > 0 ? (
              <div className="text-brand-300 font-medium mt-0.5">
                {habit
                  ? 'Completed ✨'
                  : `${hoveredCell.cell.count} of ${hoveredCell.cell.totalScheduled} habits completed`}
              </div>
            ) : (
              <div className="text-slate-400 mt-0.5">No completions logged</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
