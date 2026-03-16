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
}

export interface TimerState {
  secondsRemaining: number;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  progress: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
}
