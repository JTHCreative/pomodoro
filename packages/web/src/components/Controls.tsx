import React from 'react';
import { motion } from 'framer-motion';
import { ThemeColors } from '@pomodoro/shared';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  colors: ThemeColors;
}

const buttonBase: React.CSSProperties = {
  padding: '14px 36px',
  borderRadius: '50px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  cursor: 'pointer',
  letterSpacing: '0.03em',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
};

export default function Controls({ isRunning, onStart, onPause, onReset, colors }: ControlsProps) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRunning ? onPause : onStart}
        style={{
          ...buttonBase,
          backgroundColor: colors.buttonPrimary,
          color: '#fff',
        }}
      >
        {isRunning ? '⏸  Pause' : '▶  Start'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        style={{
          ...buttonBase,
          backgroundColor: colors.buttonSecondary,
          color: colors.text,
        }}
      >
        ↺  Reset
      </motion.button>
    </div>
  );
}
