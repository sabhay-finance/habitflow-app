import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../constants/config';
import { Button } from '../common/Button';

interface LevelUpModalProps {
  data: {
    newLevel: number;
    title: string;
    icon: string;
  } | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch {
        // Fallback
      }
    }
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-center text-white border border-brand-500/30 shadow-2xl shadow-brand-500/20 z-10 overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/25 blur-3xl pointer-events-none" />

            {/* Pulsating Icon */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-brand-600 via-violet-500 to-amber-400 flex items-center justify-center text-5xl shadow-xl shadow-brand-500/30 border border-white/20"
            >
              {data.icon}
            </motion.div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level Up!</span>
            </div>

            <h3 className="text-3xl font-black tracking-tight text-white mb-1">
              Level {data.newLevel}
            </h3>
            <p className="text-lg font-bold text-brand-300 mb-4">{data.title}</p>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Your dedication is building true momentum. Every completed habit strengthens your daily
              routine and unlocks new heights!
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={onClose}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full bg-gradient-to-r from-brand-500 to-violet-600 shadow-lg shadow-brand-500/40"
            >
              Keep Flowing
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
