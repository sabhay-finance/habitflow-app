import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Compass } from 'lucide-react';
import { STARTER_TEMPLATES } from '../../constants/config';
import { Button } from './Button';

interface EmptyStateProps {
  onAddCustom: () => void;
  onSelectTemplate: (template: (typeof STARTER_TEMPLATES)[0]) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddCustom,
  onSelectTemplate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-10 px-4 max-w-lg mx-auto"
    >
      {/* Playful Illustration */}
      <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-brand-500/20 via-violet-400/20 to-amber-300/20 dark:from-brand-500/30 dark:to-cyan-400/20 flex items-center justify-center shadow-inner border border-brand-200/50 dark:border-brand-700/30"
        >
          <span className="text-5xl select-none">🌱</span>
        </motion.div>

        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2 p-2 bg-amber-400 text-amber-950 rounded-2xl shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>

        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 -left-2 p-2 bg-brand-500 text-white rounded-2xl shadow-lg"
        >
          <Compass className="w-5 h-5" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Your Journey Starts With One Spark
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
        Great habits aren’t built overnight—they’re sculpted one satisfying checkmark at a time.
        Pick a starter template below or forge your own custom routine.
      </p>

      {/* Starter Template Chips */}
      <div className="space-y-3 mb-8 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Quick-Start Starter Habits
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STARTER_TEMPLATES.map((template) => (
            <motion.button
              key={template.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTemplate(template)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm flex items-center gap-3 text-left transition-colors group"
            >
              <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                {template.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {template.description}
                </p>
              </div>
              <Plus className="w-4 h-4 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Habit Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onAddCustom}
        icon={<Plus className="w-5 h-5" />}
        className="w-full sm:w-auto"
      >
        Create Custom Habit
      </Button>
    </motion.div>
  );
};
