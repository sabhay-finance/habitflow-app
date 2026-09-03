import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_CONFIG } from '../../constants/config';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      const diff = value - prevValueRef.current;
      const stepTime = Math.max(20, Math.floor(ANIMATION_CONFIG.counterRollDurationMs / Math.abs(diff || 1)));

      let current = prevValueRef.current;
      const interval = setInterval(() => {
        if (current < value) {
          current++;
          setDisplayValue(current);
        } else if (current > value) {
          current--;
          setDisplayValue(current);
        } else {
          clearInterval(interval);
        }
      }, stepTime);

      prevValueRef.current = value;
      return () => clearInterval(interval);
    }
  }, [value]);

  return (
    <span className={`inline-flex items-center tabular-nums font-mono ${className}`}>
      {prefix && <span>{prefix}</span>}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: -8, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 8, opacity: 0, scale: 0.8 }}
          transition={ANIMATION_CONFIG.spring.bounce}
          className="inline-block"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};
