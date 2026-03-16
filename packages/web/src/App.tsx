import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer, oceanTheme, forestTheme, skyTheme, Theme } from '@pomodoro/shared';
import Timer from './components/Timer';
import ThemeBar from './components/ThemeBar';
import Controls from './components/Controls';
import OceanScene from './components/animations/OceanScene';
import ForestScene from './components/animations/ForestScene';
import SkyScene from './components/animations/SkyScene';

const themes: Theme[] = [oceanTheme, forestTheme, skyTheme];

const sceneMap: Record<Theme['id'], React.ComponentType> = {
  ocean: OceanScene,
  forest: ForestScene,
  sky: SkyScene,
};

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState<Theme['id']>('ocean');
  const timer = useTimer();

  const activeTheme = themes.find((t) => t.id === activeThemeId)!;
  const Scene = sceneMap[activeThemeId];

  const handleSelectTheme = useCallback((id: Theme['id']) => {
    setActiveThemeId(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeThemeId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundColor: activeTheme.colors.background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          overflow: 'hidden',
        }}
      >
        {/* Animated background */}
        <Scene />

        {/* Content layer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '36px',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 600,
              color: activeTheme.colors.text,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Pomodoro
          </h1>

          {/* Theme selector */}
          <ThemeBar
            themes={themes}
            activeThemeId={activeThemeId}
            onSelectTheme={handleSelectTheme}
          />

          {/* Timer ring */}
          <Timer
            minutes={timer.minutes}
            seconds={timer.seconds}
            progress={timer.progress}
            colors={activeTheme.colors}
          />

          {/* Start / Pause / Reset */}
          <Controls
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            colors={activeTheme.colors}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
