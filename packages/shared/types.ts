export interface ThemeColors {
  background: string;
  surface: string;
  accent: string;
  text: string;
  buttonPrimary: string;
  buttonSecondary: string;
  timerText: string;
  ringTrack: string;
  ringFill: string;
}

export interface Theme {
  name: string;
  id: 'ocean' | 'forest' | 'sky';
  icon: string;
  colors: ThemeColors;
  darkColors: ThemeColors;
}

export type TimerPhase = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface BreakSettings {
  shortBreakMinutes: number; // 5-10
  longBreakMinutes: number;  // 15-30
}

export interface TimerState {
  secondsRemaining: number;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  progress: number;
  phase: TimerPhase;
  sessionCount: number; // completed pomodoro sessions (0-4)
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}
