import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState, TimerActions } from '../types';

const POMODORO_DURATION = 25 * 60; // 1500 seconds

export function useTimer(): TimerState & TimerActions {
  const [secondsRemaining, setSecondsRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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
    setSecondsRemaining(POMODORO_DURATION);
  }, [clearTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, clearTimer]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = 1 - secondsRemaining / POMODORO_DURATION;

  return {
    secondsRemaining,
    isRunning,
    minutes,
    seconds,
    progress,
    start,
    pause,
    reset,
  };
}
