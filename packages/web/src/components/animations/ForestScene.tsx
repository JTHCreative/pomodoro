import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function FallingLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 120,
        color: ['#A5D6A7', '#81C784', '#C8E6C9', '#B9D9A0'][i % 4],
      })),
    []
  );

  return (
    <>
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          style={{
            position: 'absolute',
            top: '-30px',
            left: `${l.x}%`,
            width: l.size,
            height: l.size * 0.7,
            borderRadius: '50% 0 50% 0',
            backgroundColor: l.color,
            opacity: 0,
          }}
          animate={{
            y: [0, window.innerHeight + 60],
            x: [0, l.drift],
            rotate: [l.rotation, l.rotation + 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function Fireflies() {
  const flies = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
        size: 3 + Math.random() * 4,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <>
      {flies.map((f) => (
        <motion.div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            borderRadius: '50%',
            backgroundColor: '#E8F5E9',
            boxShadow: `0 0 ${f.size * 2}px ${f.size}px rgba(232,245,233,0.5)`,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.8, 1.2, 0.8],
            x: [0, (Math.random() - 0.5) * 20, 0],
            y: [0, (Math.random() - 0.5) * 20, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function TreeSilhouettes() {
  return (
    <>
      {/* Left tree group */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '5%',
          width: '80px',
          height: '200px',
          background:
            'linear-gradient(to top, rgba(51,105,30,0.15), rgba(51,105,30,0.05), transparent)',
          borderRadius: '40% 40% 0 0',
        }}
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Right tree group */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          right: '8%',
          width: '100px',
          height: '240px',
          background:
            'linear-gradient(to top, rgba(51,105,30,0.12), rgba(51,105,30,0.04), transparent)',
          borderRadius: '40% 40% 0 0',
        }}
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      {/* Center small tree */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '45%',
          width: '60px',
          height: '160px',
          background:
            'linear-gradient(to top, rgba(51,105,30,0.1), rgba(51,105,30,0.03), transparent)',
          borderRadius: '40% 40% 0 0',
        }}
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    </>
  );
}

export default function ForestScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <TreeSilhouettes />
      <FallingLeaves />
      <Fireflies />
    </div>
  );
}
