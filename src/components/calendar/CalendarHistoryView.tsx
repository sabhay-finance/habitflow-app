import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Snowflake,
  AlertCircle,
} from 'lucide-react';
import type { Habit, CompletionLog, StreakFreeze } from '../../types';
import { formatDate, getTodayDateString, isHabitScheduledForDate } from '../../utils/date';
import { ANIMATION_CONFIG, getColorTheme } from '../../constants/config';
import { Button } from '../common/Button';

interface CalendarHistoryViewProps {
  habits: Habit[];
  logs: CompletionLog[];
  freezes: StreakFreeze[];
  onToggleHabit: (habitId: string, date: string) => void;
}

export const CalendarHistoryView: React.FC<CalendarHistoryViewProps> = ({
  habits,
  logs,
  freezes,
  onToggleHabit,
}) => {
  const todayStr = getTodayDateString();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const completedSet = useMemo(() => {
    return new Set(logs.map((l) => `${l.habitId}_${l.date}`));
  }, [logs]);

  const freezeSet = useMemo(() => {
    return new Set(freezes.map((f) => `${f.habitId}_${f.date}`));
  }, [freezes]);

  // Log map by habitId_date to get completedAt timestamp
  const logMap = useMemo(() => {
    const map = new Map<string, CompletionLog>();
    for (const log of logs) {
      map.set(`${log.habitId}_${log.date}`, log);
    }
    return map;
  }, [logs]);

  // Year & Month details
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentMonthDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Day calculations for month
  const calendarDays = useMemo(() => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);

      // Scheduled habits for this day
      const scheduledHabits = habits.filter((h) =>
        isHabitScheduledForDate(h.frequency, dateStr)
      );

      const completedCount = scheduledHabits.filter((h) =>
        completedSet.has(`${h.id}_${dateStr}`)
      ).length;

      const frozenCount = scheduledHabits.filter((h) =>
        freezeSet.has(`${h.id}_${dateStr}`)
      ).length;

      const totalScheduled = scheduledHabits.length;
      const effectiveSuccess = completedCount + frozenCount;
      const rate = totalScheduled > 0 ? Math.round((effectiveSuccess / totalScheduled) * 100) : 0;

      const isFuture = dateStr > todayStr;
      const isToday = dateStr === todayStr;

      let status: 'perfect' | 'partial' | 'missed' | 'empty' | 'future' = 'empty';
      if (isFuture) {
        status = 'future';
      } else if (totalScheduled === 0) {
        status = 'empty';
      } else if (rate === 100) {
        status = 'perfect';
      } else if (effectiveSuccess > 0) {
        status = 'partial';
      } else {
        status = 'missed';
      }

      days.push({
        day,
        dateStr,
        totalScheduled,
        completedCount,
        frozenCount,
        rate,
        status,
        isToday,
        isFuture,
      });
    }
    return days;
  }, [year, month, daysInMonth, habits, completedSet, freezeSet, todayStr]);

  // Selected date details
  const selectedDayInfo = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const formattedHeader = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const scheduledHabits = habits.filter((h) =>
      isHabitScheduledForDate(h.frequency, selectedDateStr)
    );

    const habitStatuses = scheduledHabits.map((h) => {
      const isCompleted = completedSet.has(`${h.id}_${selectedDateStr}`);
      const isFrozen = freezeSet.has(`${h.id}_${selectedDateStr}`);
      const log = logMap.get(`${h.id}_${selectedDateStr}`);
      return {
        habit: h,
        isCompleted,
        isFrozen,
        completedAt: log?.completedAt,
        xpEarned: log?.xpEarned,
      };
    });

    const completedCount = habitStatuses.filter((s) => s.isCompleted).length;
    const totalScheduled = scheduledHabits.length;
    const rate = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;

    return {
      dateStr: selectedDateStr,
      formattedHeader,
      habitStatuses,
      completedCount,
      totalScheduled,
      rate,
      isToday: selectedDateStr === todayStr,
      isFuture: selectedDateStr > todayStr,
    };
  }, [selectedDateStr, habits, completedSet, freezeSet, logMap, todayStr]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-black mb-1">
            <CalendarIcon className="w-3 h-3" />
            <span>Habit History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Calendar &amp; Consistency
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Inspect daily performance, review history, or adjust past completions.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleGoToday}>
            Today
          </Button>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-2 select-none min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1 border-b border-slate-100 dark:border-slate-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-2xl bg-transparent" />
          ))}

          {/* Actual Month Days */}
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;

            return (
              <motion.button
                key={day.dateStr}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedDateStr(day.dateStr)}
                className={`relative h-14 sm:h-16 rounded-2xl p-1 sm:p-1.5 flex flex-col justify-between items-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'ring-2 ring-brand-500 border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm z-10'
                    : day.isToday
                    ? 'border-brand-300 dark:border-brand-700 bg-slate-50/80 dark:bg-slate-800/50'
                    : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                }`}
              >
                {/* Day Number */}
                <span
                  className={`text-xs font-black ${
                    day.isToday
                      ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                      : day.isFuture
                      ? 'text-slate-300 dark:text-slate-600'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {day.day}
                </span>

                {/* Status Indicator Icon / Dot */}
                <div className="w-full flex items-center justify-center">
                  {day.isFuture ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 opacity-40" />
                  ) : day.status === 'perfect' ? (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="hidden sm:inline">100%</span>
                    </div>
                  ) : day.status === 'partial' ? (
                    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{day.rate}%</span>
                    </div>
                  ) : day.status === 'missed' ? (
                    <div className="w-2 h-2 rounded-full bg-rose-400 dark:bg-rose-500" title="Missed scheduled habits" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>

                {/* Progress bar line at bottom of cell */}
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      day.status === 'perfect'
                        ? 'bg-emerald-500'
                        : day.status === 'partial'
                        ? 'bg-amber-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${day.rate}%` }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex-wrap border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>100% Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Partially Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>No Habits / Rest</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.spring.bounce}
        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {selectedDayInfo.formattedHeader}
              </h3>
              {selectedDayInfo.isToday && (
                <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-[10px] font-black uppercase tracking-wider">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {selectedDayInfo.totalScheduled === 0
                ? 'No habits were scheduled for this date.'
                : `${selectedDayInfo.completedCount} of ${selectedDayInfo.totalScheduled} habits completed (${selectedDayInfo.rate}%)`}
            </p>
          </div>

          {/* Progress badge */}
          {selectedDayInfo.totalScheduled > 0 && (
            <div
              className={`px-3 py-1.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 self-start sm:self-auto ${
                selectedDayInfo.rate === 100
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40'
                  : selectedDayInfo.completedCount > 0
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {selectedDayInfo.rate === 100 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Flawless Day</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedDayInfo.rate}% Completed</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Habit List for Selected Day */}
        {selectedDayInfo.habitStatuses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
            No routines were scheduled for this day. Enjoy your rest! 🌿
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayInfo.habitStatuses.map(({ habit, isCompleted, isFrozen, completedAt, xpEarned }) => {
              const theme = getColorTheme(habit.color);

              return (
                <div
                  key={habit.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : isFrozen
                      ? 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${theme.bgLight} ${theme.bgDark}`}
                    >
                      {habit.emoji}
                    </span>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold tracking-tight truncate ${
                          isCompleted
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {isCompleted && completedAt ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed ({new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                            {xpEarned && ` • +${xpEarned} XP`}
                          </span>
                        ) : isFrozen ? (
                          <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                            <Snowflake className="w-3 h-3" />
                            Streak Freeze Applied
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {selectedDayInfo.isFuture ? 'Upcoming' : 'Missed'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle button allowing check/uncheck for this date */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onToggleHabit(habit.id, selectedDayInfo.dateStr)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-400 hover:border-brand-500 hover:text-brand-500'
                    }`}
                    title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                    aria-label={`Toggle ${habit.name}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
