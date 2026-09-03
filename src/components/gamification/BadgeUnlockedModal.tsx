import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Check } from 'lucide-react';
import type { Badge } from '../../types';
import { ANIMATION_CONFIG } from '../../constants/config';
import { Button } from '../common/Button';

interface BadgeUnlockedModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  onClose,
}) => {
  useEffect(() => {
    if (badge) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
        });
      } catch {
        // Fallback
      }
    }
  }, [badge]);

  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
          >
            {/* Pulsating Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -6, 6, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr ${badge.gradient} flex items-center justify-center text-5xl shadow-xl shadow-brand-500/20 text-white`}
            >
              {badge.icon}
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Badge Unlocked!</span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
              {badge.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {badge.description}
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              icon={<Check className="w-4 h-4" />}
              className="w-full"
            >
              Awesome!
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
