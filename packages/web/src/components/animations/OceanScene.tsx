import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function Bubbles() {
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
            backgroundColor: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.3)',
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

function Waves() {
  return (
    <>
      {/* Wave 1 — back */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          width: '110%',
          height: '120px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(126,200,227,0.35) 0%, transparent 70%)',
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, 30, 0], y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Wave 2 — mid */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-8%',
          width: '116%',
          height: '90px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(137,207,240,0.4) 0%, transparent 70%)',
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, -25, 0], y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* Wave 3 — front */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-3%',
          width: '106%',
          height: '60px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(182,227,244,0.5) 0%, transparent 70%)',
          borderRadius: '50% 50% 0 0',
        }}
        animate={{ x: [0, 20, 0], y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </>
  );
}

function Shimmer() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '30%',
        left: '10%',
        width: '80%',
        height: '2px',
        background:
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        borderRadius: '2px',
      }}
      animate={{ opacity: [0, 0.6, 0], x: ['-20%', '20%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function OceanScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Shimmer />
      <Bubbles />
      <Waves />
    </div>
  );
}
