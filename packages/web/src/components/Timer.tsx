import React from 'react';
import { motion } from 'framer-motion';
import { ThemeColors } from '@pomodoro/shared';

interface TimerProps {
  minutes: number;
  seconds: number;
  progress: number;
  colors: ThemeColors;
}

const SIZE = 280;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ minutes, seconds, progress, colors }: TimerProps) {
  const offset = CIRCUMFERENCE * (1 - progress);
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = minutes * 60 + seconds;
  const isLastMinute = totalSeconds <= 60 && totalSeconds > 0;

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.ringTrack}
          strokeWidth={STROKE_WIDTH}
          opacity={0.5}
        />
        {/* Progress */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.ringFill}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </svg>

      {/* Time display */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLastMinute ? (
          /* Last 60 seconds: pulse animation on each tick */
          <motion.span
            key={timeString}
            initial={{ scale: 1.08, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '4rem',
              fontWeight: 600,
              color: colors.timerText,
              letterSpacing: '0.05em',
              userSelect: 'none',
            }}
          >
            {timeString}
          </motion.span>
        ) : (
          /* Normal countdown: static text, no pulse */
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '4rem',
              fontWeight: 600,
              color: colors.timerText,
              letterSpacing: '0.05em',
              userSelect: 'none',
            }}
          >
            {timeString}
          </span>
        )}
      </div>
    </div>
  );
}
