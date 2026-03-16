import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function Stars() {
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
            backgroundColor: '#FFFFFF',
          }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.1, 0.8] }}
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

function Moon() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '8%',
        right: '15%',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 35%, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
        boxShadow: '0 0 40px 15px rgba(206,147,216,0.25), 0 0 80px 30px rgba(206,147,216,0.1)',
      }}
      animate={{
        y: [0, -8, 0],
        boxShadow: [
          '0 0 40px 15px rgba(206,147,216,0.25), 0 0 80px 30px rgba(206,147,216,0.1)',
          '0 0 50px 20px rgba(206,147,216,0.35), 0 0 100px 40px rgba(206,147,216,0.15)',
          '0 0 40px 15px rgba(206,147,216,0.25), 0 0 80px 30px rgba(206,147,216,0.1)',
        ],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Inner crescent shadow */}
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

function ShootingStar() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '15%',
        left: '-5%',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
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
      {/* Tail */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '100%',
          width: '50px',
          height: '1.5px',
          background: 'linear-gradient(to left, rgba(255,255,255,0.7), transparent)',
          transformOrigin: 'right center',
          transform: 'translateY(-50%)',
        }}
      />
    </motion.div>
  );
}

function CloudWisps() {
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
            background: 'rgba(255,255,255,0.06)',
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

export default function SkyScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <CloudWisps />
      <Stars />
      <Moon />
      <ShootingStar />
    </div>
  );
}
