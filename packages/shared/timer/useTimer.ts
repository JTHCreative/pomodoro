import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState, TimerActions, TimerPhase, BreakSettings } from '../types';

const POMODORO_DURATION = 25 * 60; // 1500 seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

function getPhaseDuration(phase: TimerPhase, settings: BreakSettings): number {
  switch (phase) {
    case 'pomodoro':
      return POMODORO_DURATION;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
  }
}

export function useTimer(
  breakSettings: BreakSettings,
  onPhaseComplete?: (phase: TimerPhase) => void,
): TimerState & TimerActions {
  const [phase, setPhase] = useState<TimerPhase>('pomodoro');
  const [sessionCount, setSessionCount] = useState(0); // completed pomodoro sessions
  const [secondsRemaining, setSecondsRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onPhaseCompleteRef = useRef(onPhaseComplete);
  onPhaseCompleteRef.current = onPhaseComplete;

  const duration = getPhaseDuration(phase, breakSettings);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(() => {
    if (phase === 'pomodoro') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount >= SESSIONS_BEFORE_LONG_BREAK) {
        setPhase('longBreak');
        setSecondsRemaining(breakSettings.longBreakMinutes * 60);
        setSessionCount(0);
      } else {
        setPhase('shortBreak');
        setSecondsRemaining(breakSettings.shortBreakMinutes * 60);
      }
    } else {
      // After any break, go back to pomodoro
      setPhase('pomodoro');
      setSecondsRemaining(POMODORO_DURATION);
    }
  }, [phase, sessionCount, breakSettings]);

  const start = useCallback(() => {
    if (secondsRemaining <= 0) return;
    setIsRunning(true);
  }, [secondsRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setPhase('pomodoro');
    setSessionCount(0);
    setSecondsRemaining(POMODORO_DURATION);
  }, [clearTimer]);

  const skip = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    // If skipping a pomodoro, don't count it as completed
    if (phase === 'pomodoro') {
      // Skip to next break without counting
      const nextCount = sessionCount + 1;
      if (nextCount >= SESSIONS_BEFORE_LONG_BREAK) {
        setPhase('longBreak');
        setSecondsRemaining(breakSettings.longBreakMinutes * 60);
        setSessionCount(0);
      } else {
        setSessionCount(nextCount);
        setPhase('shortBreak');
        setSecondsRemaining(breakSettings.shortBreakMinutes * 60);
      }
    } else {
      setPhase('pomodoro');
      setSecondsRemaining(POMODORO_DURATION);
    }
  }, [phase, sessionCount, breakSettings, clearTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Notify that phase completed
            onPhaseCompleteRef.current?.(phase);
            // Auto-advance to next phase after a brief moment
            setTimeout(() => advancePhase(), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, clearTimer, phase, advancePhase]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = 1 - secondsRemaining / duration;

  return {
    secondsRemaining,
    isRunning,
    minutes,
    seconds,
    progress,
    phase,
    sessionCount,
    start,
    pause,
    reset,
    skip,
  };
}
