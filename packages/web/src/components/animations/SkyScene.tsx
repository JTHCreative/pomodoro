import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SkySceneProps {
  isDark: boolean;
}

function Stars({ isDark }: { isDark: boolean }) {
  const starColor = isDark ? '#FFFFFF' : '#FFFFFF';
  const baseOpacity = isDark ? 0.4 : 0.2;
  const peakOpacity = isDark ? 1.0 : 0.9;

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 80,
        size: 1.5 + Math.random() * 3,
        duration: 1.5 + Math.random() * 3,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            backgroundColor: starColor,
            boxShadow: isDark ? `0 0 ${s.size * 2}px ${s.size * 0.5}px rgba(255,255,255,0.3)` : 'none',
          }}
          animate={{ opacity: [baseOpacity, peakOpacity, baseOpacity], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function Moon({ isDark }: { isDark: boolean }) {
  const moonBg = isDark
    ? 'radial-gradient(circle at 35% 35%, #E8E0F0 0%, #C8A8E0 50%, #A070C0 100%)'
    : 'radial-gradient(circle at 35% 35%, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)';
  const glowAlpha = isDark ? 0.4 : 0.25;
  const glowAlpha2 = isDark ? 0.2 : 0.1;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '8%',
        right: '15%',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: moonBg,
        boxShadow: `0 0 40px 15px rgba(206,147,216,${glowAlpha}), 0 0 80px 30px rgba(206,147,216,${glowAlpha2})`,
      }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '15px',
          width: '55px',
          height: '55px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 60% 40%, rgba(214,210,232,0.6) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

function ShootingStar({ isDark }: { isDark: boolean }) {
  const color = isDark ? '#FFFFFF' : '#FFFFFF';
  const glowAlpha = isDark ? 0.8 : 0.6;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '15%',
        left: '-5%',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 6px 2px rgba(255,255,255,${glowAlpha})`,
      }}
      animate={{
        x: [0, window.innerWidth * 0.7],
        y: [0, window.innerHeight * 0.3],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        delay: 8,
        repeat: Infinity,
        repeatDelay: 12 + Math.random() * 8,
        ease: 'easeOut',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '100%',
          width: '50px',
          height: '1.5px',
          background: `linear-gradient(to left, rgba(255,255,255,${isDark ? 0.9 : 0.7}), transparent)`,
          transformOrigin: 'right center',
          transform: 'translateY(-50%)',
        }}
      />
    </motion.div>
  );
}

function CloudWisps({ isDark }: { isDark: boolean }) {
  const color = isDark ? 'rgba(139,111,192,0.1)' : 'rgba(255,255,255,0.06)';

  const wisps = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        x: 10 + i * 25,
        y: 60 + Math.random() * 30,
        width: 80 + Math.random() * 60,
        duration: 20 + Math.random() * 15,
      })),
    []
  );

  return (
    <>
      {wisps.map((w) => (
        <motion.div
          key={w.id}
          style={{
            position: 'absolute',
            left: `${w.x}%`,
            top: `${w.y}%`,
            width: w.width,
            height: 8,
            borderRadius: '10px',
            background: color,
          }}
          animate={{ x: [0, 40, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{
            duration: w.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

export default function SkyScene({ isDark }: SkySceneProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <CloudWisps isDark={isDark} />
      <Stars isDark={isDark} />
      <Moon isDark={isDark} />
      <ShootingStar isDark={isDark} />
    </div>
  );
}
