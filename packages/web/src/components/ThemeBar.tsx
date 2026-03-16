import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '@pomodoro/shared';
import { WaveIcon, TreeIcon, StarsIcon } from './Icons';

const themeIcons: Record<Theme['id'], React.ComponentType<{ size?: number; color?: string }>> = {
  ocean: WaveIcon,
  forest: TreeIcon,
  sky: StarsIcon,
};

interface ThemeBarProps {
  themes: Theme[];
  activeThemeId: string;
  isDark: boolean;
  onSelectTheme: (id: Theme['id']) => void;
}

export default function ThemeBar({ themes, activeThemeId, isDark, onSelectTheme }: ThemeBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '10px 20px',
        borderRadius: '50px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {themes.map((theme) => {
        const isActive = theme.id === activeThemeId;
        const c = isDark ? theme.darkColors : theme.colors;
        const Icon = themeIcons[theme.id];
        return (
          <motion.button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '30px',
              border: isActive
                ? `2px solid ${c.accent}`
                : '2px solid transparent',
              backgroundColor: isActive ? c.surface : 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: c.text,
              transition: 'background-color 0.3s, border-color 0.3s',
            }}
          >
            <Icon size={18} color={c.text} />
            <span>{theme.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
