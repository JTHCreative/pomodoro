import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer, oceanTheme, forestTheme, skyTheme, Theme } from '@pomodoro/shared';
import Timer from './components/Timer';
import ThemeBar from './components/ThemeBar';
import Controls from './components/Controls';
import OceanScene from './components/animations/OceanScene';
import ForestScene from './components/animations/ForestScene';
import SkyScene from './components/animations/SkyScene';
import { playAmbience, stopAmbience } from './audio/ambience';

const themes: Theme[] = [oceanTheme, forestTheme, skyTheme];

const sceneMap: Record<Theme['id'], React.ComponentType> = {
  ocean: OceanScene,
  forest: ForestScene,
  sky: SkyScene,
};

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState<Theme['id']>('ocean');
  const [audioOn, setAudioOn] = useState(false);
  const timer = useTimer();

  const activeTheme = themes.find((t) => t.id === activeThemeId)!;
  const Scene = sceneMap[activeThemeId];

  const handleSelectTheme = useCallback((id: Theme['id']) => {
    setActiveThemeId(id);
  }, []);

  // Play/stop ambient audio when theme or toggle changes
  useEffect(() => {
    if (audioOn) {
      playAmbience(activeThemeId);
    } else {
      stopAmbience();
    }
    return () => stopAmbience();
  }, [activeThemeId, audioOn]);

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
          {/* Title + Signature */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '2.4rem',
                fontWeight: 700,
                color: activeTheme.colors.text,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              Pomodoro
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  color: activeTheme.colors.text,
                  opacity: 0.5,
                  position: 'relative',
                  top: '-12px',
                }}
              >
                by
              </span>
              <img
                src="/signature.png"
                alt="signature"
                style={{
                  height: '40px',
                }}
              />
            </div>
          </div>

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

          {/* Sound toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAudioOn((prev) => !prev)}
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              color: activeTheme.colors.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            title={audioOn ? 'Mute ambient sound' : 'Play ambient sound'}
          >
            {audioOn ? '🔊' : '🔇'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
