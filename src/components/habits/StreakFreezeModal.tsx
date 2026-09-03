import React from 'react';
import { motion } from 'framer-motion';
import { Snowflake, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import type { Habit } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getYesterdayDateString, getTodayDateString, getFriendlyDateLabel } from '../../utils/date';

interface StreakFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  freezesAvailable: number;
  onApplyFreeze: (habitId: string, date: string) => void;
}

export const StreakFreezeModal: React.FC<StreakFreezeModalProps> = ({
  isOpen,
  onClose,
  habit,
  freezesAvailable,
  onApplyFreeze,
}) => {
  if (!habit) return null;

  const yesterday = getYesterdayDateString();
  const today = getTodayDateString();

  const handleFreeze = (targetDate: string) => {
    onApplyFreeze(habit.id, targetDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Streak Freeze Protection" maxWidth="sm">
      <div className="text-center space-y-4">
        {/* Animated Icy Shield Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 8, -8, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-teal-400/20 dark:from-cyan-500/30 dark:to-blue-600/30 flex items-center justify-center shadow-lg border border-cyan-300/40 dark:border-cyan-700/40"
          >
            <Snowflake className="w-10 h-10 text-cyan-500 animate-spin-slow" />
          </motion.div>
          <div className="absolute -top-1 -right-1 p-1.5 bg-blue-500 text-white rounded-xl shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white">
            Protect {habit.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Life happens! A Streak Freeze acts as a magical shield that preserves your hard-earned streak
            when you miss a scheduled day.
          </p>
        </div>

        {/* Freezes Available Pill */}
        <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-between text-xs">
          <span className="font-semibold text-cyan-900 dark:text-cyan-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Freezes This Week:
          </span>
          <span className="font-bold px-2 py-0.5 rounded-full bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-100">
            {freezesAvailable} / 1 Available
          </span>
        </div>

        {freezesAvailable > 0 ? (
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Day To Protect:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFreeze(yesterday)}
                className="w-full text-xs font-bold border-cyan-300 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/60"
              >
                Yesterday ({getFriendlyDateLabel(yesterday)})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFreeze(today)}
                className="w-full text-xs font-bold border-cyan-300 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/60"
              >
                Today (Proactive)
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              You’ve already deployed your weekly freeze! Your freeze replenishes every Monday at midnight.
            </span>
          </div>
        )}

        <div className="pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
