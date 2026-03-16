import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer, oceanTheme, forestTheme, skyTheme, Theme, BreakSettings, TimerPhase } from '@pomodoro/shared';
import Timer from './components/Timer';
import ThemeBar from './components/ThemeBar';
import Controls from './components/Controls';
import OceanScene from './components/animations/OceanScene';
import ForestScene from './components/animations/ForestScene';
import SkyScene from './components/animations/SkyScene';
import { playAmbience, stopAmbience, tickCountdown } from './audio/ambience';
import { GearIcon, SunIcon, MoonIcon, VolumeOnIcon, VolumeOffIcon } from './components/Icons';

const themes: Theme[] = [oceanTheme, forestTheme, skyTheme];

const sceneMap: Record<Theme['id'], React.ComponentType<{ isDark: boolean }>> = {
  ocean: OceanScene,
  forest: ForestScene,
  sky: SkyScene,
};

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState<Theme['id']>('ocean');
  const [audioOn, setAudioOn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [breakSettings, setBreakSettings] = useState<BreakSettings>({
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
  });

  const handlePhaseComplete = useCallback((phase: TimerPhase) => {
    // Final beep is already played by tickCountdown at 0
  }, []);

  const timer = useTimer(breakSettings, handlePhaseComplete);
  const prevSecondsRef = useRef(timer.secondsRemaining);

  const activeTheme = themes.find((t) => t.id === activeThemeId)!;
  const colors = isDark ? activeTheme.darkColors : activeTheme.colors;
  const Scene = sceneMap[activeThemeId];

  const handleSelectTheme = useCallback((id: Theme['id']) => {
    setActiveThemeId(id);
  }, []);

  // Play countdown beeps when timer is running and in last 10 seconds
  useEffect(() => {
    if (timer.isRunning && timer.secondsRemaining !== prevSecondsRef.current) {
      tickCountdown(timer.secondsRemaining);
    }
    prevSecondsRef.current = timer.secondsRemaining;
  }, [timer.secondsRemaining, timer.isRunning]);

  // Auto-start break timers after pomodoro completes
  useEffect(() => {
    if (!timer.isRunning && timer.secondsRemaining > 0 && timer.phase !== 'pomodoro') {
      // If we just transitioned to a break phase, auto-start after a brief delay
      const timeout = setTimeout(() => {
        timer.start();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer.phase]);

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
        key={`${activeThemeId}-${isDark}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundColor: colors.background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          overflow: 'hidden',
        }}
      >
        {/* Animated background */}
        <Scene isDark={isDark} />

        {/* Settings gear — top right */}
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 30 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSettingsOpen((prev) => !prev)}
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: '50%',
              width: 42,
              height: 42,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: colors.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            title="Settings"
          >
            <GearIcon size={20} color={colors.text} />
          </motion.button>

          {/* Settings dropdown */}
          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 50,
                  right: 0,
                  background: isDark ? 'rgba(20,20,40,0.85)' : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '16px 24px',
                  minWidth: '260px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: colors.text,
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Settings
                </span>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setIsDark((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '8px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: colors.text,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isDark ? <MoonIcon size={16} color={colors.text} /> : <SunIcon size={16} color={colors.text} />}
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <div
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: isDark ? colors.accent : 'rgba(0,0,0,0.15)',
                      position: 'relative',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <motion.div
                      animate={{ x: isDark ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        position: 'absolute',
                        top: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                </button>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: colors.text, opacity: 0.1 }} />

                {/* Break duration settings label */}
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: colors.text,
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Break Durations
                </span>

                {/* Short Break setting */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: colors.text,
                    }}
                  >
                    Short Break
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setBreakSettings((prev) => ({
                          ...prev,
                          shortBreakMinutes: Math.max(5, prev.shortBreakMinutes - 1),
                        }))
                      }
                      disabled={breakSettings.shortBreakMinutes <= 5}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: breakSettings.shortBreakMinutes <= 5
                          ? 'rgba(128,128,128,0.15)'
                          : colors.buttonSecondary,
                        color: breakSettings.shortBreakMinutes <= 5
                          ? 'rgba(128,128,128,0.4)'
                          : colors.text,
                        cursor: breakSettings.shortBreakMinutes <= 5 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      −
                    </motion.button>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: colors.text,
                        minWidth: '48px',
                        textAlign: 'center',
                      }}
                    >
                      {breakSettings.shortBreakMinutes}m
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setBreakSettings((prev) => ({
                          ...prev,
                          shortBreakMinutes: Math.min(10, prev.shortBreakMinutes + 1),
                        }))
                      }
                      disabled={breakSettings.shortBreakMinutes >= 10}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: breakSettings.shortBreakMinutes >= 10
                          ? 'rgba(128,128,128,0.15)'
                          : colors.buttonSecondary,
                        color: breakSettings.shortBreakMinutes >= 10
                          ? 'rgba(128,128,128,0.4)'
                          : colors.text,
                        cursor: breakSettings.shortBreakMinutes >= 10 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Long Break setting */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: colors.text,
                    }}
                  >
                    Long Break
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setBreakSettings((prev) => ({
                          ...prev,
                          longBreakMinutes: Math.max(15, prev.longBreakMinutes - 1),
                        }))
                      }
                      disabled={breakSettings.longBreakMinutes <= 15}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: breakSettings.longBreakMinutes <= 15
                          ? 'rgba(128,128,128,0.15)'
                          : colors.buttonSecondary,
                        color: breakSettings.longBreakMinutes <= 15
                          ? 'rgba(128,128,128,0.4)'
                          : colors.text,
                        cursor: breakSettings.longBreakMinutes <= 15 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      −
                    </motion.button>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: colors.text,
                        minWidth: '48px',
                        textAlign: 'center',
                      }}
                    >
                      {breakSettings.longBreakMinutes}m
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setBreakSettings((prev) => ({
                          ...prev,
                          longBreakMinutes: Math.min(30, prev.longBreakMinutes + 1),
                        }))
                      }
                      disabled={breakSettings.longBreakMinutes >= 30}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: breakSettings.longBreakMinutes >= 30
                          ? 'rgba(128,128,128,0.15)'
                          : colors.buttonSecondary,
                        color: breakSettings.longBreakMinutes >= 30
                          ? 'rgba(128,128,128,0.4)'
                          : colors.text,
                        cursor: breakSettings.longBreakMinutes >= 30 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                color: colors.text,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              Pomodoro
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  color: colors.text,
                  opacity: 0.5,
                  position: 'relative',
                  top: '-12px',
                }}
              >
                by
              </span>
              {isDark ? (
                <img
                  src={`${import.meta.env.BASE_URL}signature.png`}
                  alt="signature"
                  style={{
                    height: '40px',
                    opacity: 0.9,
                  }}
                />
              ) : (
                <div
                  role="img"
                  aria-label="signature"
                  style={{
                    height: '40px',
                    width: '120px',
                    backgroundColor: colors.text,
                    WebkitMaskImage: `url(${import.meta.env.BASE_URL}signature.png)`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: `url(${import.meta.env.BASE_URL}signature.png)`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    opacity: 0.7,
                    transition: 'background-color 0.3s',
                  }}
                />
              )}
            </div>
          </div>

          {/* Theme selector */}
          <ThemeBar
            themes={themes}
            activeThemeId={activeThemeId}
            isDark={isDark}
            onSelectTheme={handleSelectTheme}
          />

          {/* Timer ring */}
          <Timer
            minutes={timer.minutes}
            seconds={timer.seconds}
            progress={timer.progress}
            colors={colors}
            phase={timer.phase}
            sessionCount={timer.sessionCount}
          />

          {/* Start / Pause / Reset / Skip */}
          <Controls
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            onSkip={timer.skip}
            colors={colors}
          />

          {/* Sound toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAudioOn((prev) => !prev)}
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
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
              color: colors.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            title={audioOn ? 'Mute ambient sound' : 'Play ambient sound'}
          >
            {audioOn ? <VolumeOnIcon size={20} color={colors.text} /> : <VolumeOffIcon size={20} color={colors.text} />}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
