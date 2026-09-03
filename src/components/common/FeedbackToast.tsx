import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Zap, Trophy } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../constants/config';

export interface ToastMessage {
  id: string;
  type: 'streak' | 'roll' | 'perfect' | 'xp';
  title: string;
  subtitle?: string;
  xp?: number;
}

interface FeedbackToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ toast, onDismiss }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={ANIMATION_CONFIG.spring.bounce}
          onClick={onDismiss}
          className="fixed top-20 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto cursor-pointer max-w-sm w-full p-3 sm:p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 shadow-2xl flex items-center justify-between gap-3 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === 'streak'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : toast.type === 'perfect'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : toast.type === 'roll'
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                }`}
              >
                {toast.type === 'streak' && <Flame className="w-5 h-5 fill-amber-400" />}
                {toast.type === 'perfect' && <Trophy className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'roll' && <Zap className="w-5 h-5 fill-brand-400" />}
                {toast.type === 'xp' && <Sparkles className="w-5 h-5 text-violet-400" />}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate flex items-center gap-1.5">
                  {toast.title}
                </h4>
                {toast.subtitle && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {toast.subtitle}
                  </p>
                )}
              </div>
            </div>

            {toast.xp && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono text-[11px] font-black border border-brand-500/30 shrink-0">
                +{toast.xp} XP
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
