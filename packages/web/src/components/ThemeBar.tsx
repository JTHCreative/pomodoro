import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '@pomodoro/shared';

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
            <span style={{ fontSize: '1.2rem' }}>{theme.icon}</span>
            <span>{theme.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
