import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X } from 'lucide-react';
import { AESTHETIC_THEMES } from '../../constants/flocusThemes';
import { ANIMATION_CONFIG } from '../../constants/config';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            className="relative w-full max-w-2xl bg-zinc-950/95 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-rose-500/20 text-rose-400">
                  <Palette className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    Aesthetic Themes Gallery
                    <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-800/40">
                      Gothic &amp; Ambient
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Transform your dashboard ambiance, font styling, and lighting
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {AESTHETIC_THEMES.map((theme) => {
                const isSelected = theme.id === currentThemeId;

                return (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectTheme(theme.id);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden border ${
                      isSelected
                        ? 'border-white/80 bg-zinc-900 shadow-xl shadow-black ring-2 ring-white/20'
                        : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    {/* Visual Color Bar */}
                    <div
                      className={`h-1.5 w-full rounded-full bg-gradient-to-r ${theme.accentGradient} mb-3`}
                    />

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{theme.emoji}</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                            {theme.name}
                            {theme.category === 'gothic' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800/40">
                                Gothic
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
