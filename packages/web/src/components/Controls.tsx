import React from 'react';
import { motion } from 'framer-motion';
import { ThemeColors } from '@pomodoro/shared';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  colors: ThemeColors;
  isMobile?: boolean;
}

export default function Controls({ isRunning, onStart, onPause, onReset, onSkip, colors, isMobile = false }: ControlsProps) {
  const buttonBase: React.CSSProperties = {
    padding: isMobile ? '12px 24px' : '14px 36px',
    borderRadius: '50px',
    border: 'none',
    fontSize: isMobile ? '0.9rem' : '1rem',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  };

  const smallButton: React.CSSProperties = {
    padding: isMobile ? '10px 16px' : '10px 20px',
    borderRadius: '50px',
    border: 'none',
    fontSize: isMobile ? '0.8rem' : '0.85rem',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  };

  return (
    <div style={{ display: 'flex', gap: isMobile ? '10px' : '16px', alignItems: 'center' }}>
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        style={{
          ...smallButton,
          backgroundColor: colors.buttonSecondary,
          color: colors.text,
        }}
        title="Skip to next phase"
      >
        ⏭  Skip
      </motion.button>
    </div>
  );
}
