import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface OceanSceneProps {
  isDark: boolean;
}

function Bubbles({ isDark }: { isDark: boolean }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 4 + Math.random() * 10,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  const bubbleColor = isDark ? 'rgba(74,158,196,0.35)' : 'rgba(255,255,255,0.5)';
  const borderColor = isDark ? 'rgba(74,158,196,0.2)' : 'rgba(255,255,255,0.3)';

  return (
    <>
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            backgroundColor: bubbleColor,
            border: `1px solid ${borderColor}`,
          }}
          animate={{
            y: [0, -window.innerHeight - 40],
            x: [0, Math.sin(b.id) * 30, 0],
            opacity: [0, b.opacity, b.opacity, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function Waves({ isDark }: { isDark: boolean }) {
  const w1 = isDark ? 'rgba(46,125,168,0.3)' : 'rgba(126,200,227,0.35)';
  const w2 = isDark ? 'rgba(74,158,196,0.25)' : 'rgba(137,207,240,0.4)';
  const w3 = isDark ? 'rgba(26,63,92,0.4)' : 'rgba(182,227,244,0.5)';

  return (
    <>
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          width: '110%',
          height: '120px',
          background: `radial-gradient(ellipse at 50% 0%, ${w1} 0%, transparent 70%)`,
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, 30, 0], y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-8%',
          width: '116%',
          height: '90px',
          background: `radial-gradient(ellipse at 50% 0%, ${w2} 0%, transparent 70%)`,
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, -25, 0], y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-3%',
          width: '106%',
          height: '60px',
          background: `radial-gradient(ellipse at 50% 0%, ${w3} 0%, transparent 70%)`,
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, 20, 0], y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </>
  );
}

function Shimmer({ isDark }: { isDark: boolean }) {
  const color = isDark ? 'rgba(74,158,196,0.3)' : 'rgba(255,255,255,0.4)';

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '30%',
        left: '10%',
        width: '80%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        borderRadius: '2px',
      }}
      animate={{ opacity: [0, 0.6, 0], x: ['-20%', '20%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function OceanScene({ isDark }: OceanSceneProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Shimmer isDark={isDark} />
      <Bubbles isDark={isDark} />
      <Waves isDark={isDark} />
    </div>
  );
}
