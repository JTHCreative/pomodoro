import React from 'react';
import { motion } from 'framer-motion';
import { ThemeColors, TimerPhase } from '@pomodoro/shared';

interface TimerProps {
  minutes: number;
  seconds: number;
  progress: number;
  colors: ThemeColors;
  phase: TimerPhase;
  sessionCount: number;
  isMobile?: boolean;
}

const STROKE_WIDTH = 8;

const phaseLabels: Record<TimerPhase, string> = {
  pomodoro: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export default function Timer({ minutes, seconds, progress, colors, phase, sessionCount, isMobile = false }: TimerProps) {
  const SIZE = isMobile ? 220 : 280;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE * (1 - progress);
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = minutes * 60 + seconds;
  const isLastMinute = totalSeconds <= 60 && totalSeconds > 0;
  const totalSessions = 4;
  const timerFontSize = isMobile ? '3rem' : '4rem';
  const phaseFontSize = isMobile ? '0.7rem' : '0.8rem';

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.ringTrack}
          strokeWidth={STROKE_WIDTH}
          opacity={0.5}
        />
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: phaseFontSize,
            fontWeight: 600,
            color: colors.timerText,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {phaseLabels[phase]}
        </motion.span>

        {isLastMinute ? (
          <motion.span
            key={timeString}
            initial={{ scale: 1.08, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: timerFontSize,
              fontWeight: 600,
              color: colors.timerText,
              letterSpacing: '0.05em',
              userSelect: 'none',
            }}
          >
            {timeString}
          </motion.span>
        ) : (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: timerFontSize,
              fontWeight: 600,
              color: colors.timerText,
              letterSpacing: '0.05em',
              userSelect: 'none',
            }}
          >
            {timeString}
          </span>
        )}

        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          {Array.from({ length: totalSessions }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: i < sessionCount ? colors.ringFill : 'transparent',
                border: `2px solid ${colors.ringFill}`,
                opacity: i < sessionCount ? 1 : 0.35,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
