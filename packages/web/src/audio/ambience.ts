type ThemeId = 'ocean' | 'forest' | 'sky';

let audioCtx: AudioContext | null = null;
let activeNodes: AudioNode[] = [];
let activeIntervals: ReturnType<typeof setInterval>[] = [];
let currentTheme: ThemeId | null = null;
let isPlaying = false;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function cleanup() {
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];
  activeNodes.forEach((n) => {
    try {
      (n as any).stop?.();
    } catch {}
    try {
      n.disconnect();
    } catch {}
  });
  activeNodes = [];
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// ─── Ocean: layered filtered noise with slow wave-like volume modulation ───
function startOcean(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0.3;
  master.connect(ctx.destination);
  activeNodes.push(master);

  // Wave layer 1
  createWaveLayer(ctx, master, 0.18, 6, 400);
  // Wave layer 2 (offset)
  createWaveLayer(ctx, master, 0.14, 8, 300);
  // Soft wash (constant)
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 250;
  const wash = ctx.createGain();
  wash.gain.value = 0.08;
  noise.connect(lp).connect(wash).connect(master);
  noise.start();
  activeNodes.push(noise, lp, wash);
}

function createWaveLayer(ctx: AudioContext, dest: AudioNode, vol: number, period: number, freq: number) {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;

  const bp = ctx.createBiquadFilter();
  bp.type = 'lowpass';
  bp.frequency.value = freq;
  bp.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  noise.connect(bp).connect(gain).connect(dest);
  noise.start();
  activeNodes.push(noise, bp, gain);

  // Modulate volume in a wave-like pattern
  function modulate() {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(vol, now + period * 0.4);
    gain.gain.linearRampToValueAtTime(vol * 0.6, now + period * 0.55);
    gain.gain.linearRampToValueAtTime(vol * 0.8, now + period * 0.7);
    gain.gain.linearRampToValueAtTime(0.02, now + period);
  }
  modulate();
  const iv = setInterval(modulate, period * 1000);
  activeIntervals.push(iv);
}

// ─── Forest: bird chirps + ambient rustling ───
function startForest(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0.35;
  master.connect(ctx.destination);
  activeNodes.push(master);

  // Ambient rustling
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 800;
  bp.Q.value = 0.3;
  const rustleGain = ctx.createGain();
  rustleGain.gain.value = 0.02;
  noise.connect(bp).connect(rustleGain).connect(master);
  noise.start();
  activeNodes.push(noise, bp, rustleGain);

  // Bird chirps — schedule random chirps
  function chirp() {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const chirpGain = ctx.createGain();

    // Random bird pitch — lower range, gentler
    const baseFreq = 1400 + Math.random() * 1200;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * (1 + Math.random() * 0.2), now + 0.08);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.95, now + 0.18);

    // Softer attack, longer fade
    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    chirpGain.gain.linearRampToValueAtTime(0, now + 0.18);

    osc.connect(chirpGain).connect(master);
    osc.start(now);
    osc.stop(now + 0.2);

    // Sometimes do a double chirp
    if (Math.random() > 0.5) {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      const t2 = now + 0.25;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.05, t2);
      osc2.frequency.linearRampToValueAtTime(baseFreq * 1.15, t2 + 0.07);
      g2.gain.setValueAtTime(0, t2);
      g2.gain.linearRampToValueAtTime(0.05, t2 + 0.04);
      g2.gain.linearRampToValueAtTime(0, t2 + 0.15);
      osc2.connect(g2).connect(master);
      osc2.start(t2);
      osc2.stop(t2 + 0.18);
    }
  }

  // Random chirps every 1.5–4 seconds
  function scheduleChirps() {
    chirp();
    const delay = 1500 + Math.random() * 2500;
    const iv = setTimeout(() => {
      if (isPlaying && currentTheme === 'forest') scheduleChirps();
    }, delay);
    activeIntervals.push(iv as any);
  }
  scheduleChirps();
}

// ─── Sky: nighttime crickets ───
function startSky(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0.25;
  master.connect(ctx.destination);
  activeNodes.push(master);

  // Soft night air
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 350;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.035;
  noise.connect(lp).connect(airGain).connect(master);
  noise.start();
  activeNodes.push(noise, lp, airGain);

  // A single cricket chirp burst: a short series of rapid pulses
  // Real crickets chirp in bursts of 3-6 pulses, then pause
  function cricketBurst(
    freq: number,
    pan: number,
    volume: number,
    pulses: number,
  ) {
    const now = ctx.currentTime;
    const pulseLen = 0.035 + Math.random() * 0.015; // each pulse ~35-50ms
    const gapLen = 0.02 + Math.random() * 0.01;     // gap between pulses ~20-30ms
    const burstDuration = pulses * (pulseLen + gapLen);

    // Tone — use two detuned sines for warmth instead of a raw sine
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.005; // slight detune

    // Bandpass to soften the tone
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = 2;

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0, now);

    // Schedule each pulse with soft attack/release
    for (let i = 0; i < pulses; i++) {
      const pulseStart = now + i * (pulseLen + gapLen);
      const peak = volume * (0.7 + 0.3 * Math.sin(Math.PI * i / pulses)); // swell shape
      envGain.gain.setValueAtTime(0, pulseStart);
      envGain.gain.linearRampToValueAtTime(peak, pulseStart + 0.008);
      envGain.gain.setValueAtTime(peak, pulseStart + pulseLen - 0.008);
      envGain.gain.linearRampToValueAtTime(0, pulseStart + pulseLen);
    }

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    const mix = ctx.createGain();
    mix.gain.value = 0.5;

    osc1.connect(bp);
    osc2.connect(bp);
    bp.connect(envGain).connect(mix).connect(panner).connect(master);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + burstDuration + 0.05);
    osc2.stop(now + burstDuration + 0.05);
  }

  // Schedule repeating cricket patterns
  // Each cricket has its own rhythm: chirp burst, pause, repeat
  interface CricketConfig {
    freq: number;
    pan: number;
    volume: number;
    minPulses: number;
    maxPulses: number;
    minPause: number;  // ms between bursts
    maxPause: number;
  }

  const crickets: CricketConfig[] = [
    { freq: 3400, pan: -0.7, volume: 0.04, minPulses: 3, maxPulses: 5, minPause: 800, maxPause: 2500 },
    { freq: 3800, pan: 0.5,  volume: 0.03, minPulses: 4, maxPulses: 7, minPause: 600, maxPause: 2000 },
    { freq: 3100, pan: 0.3,  volume: 0.025, minPulses: 2, maxPulses: 4, minPause: 1500, maxPause: 4000 },
    { freq: 3600, pan: -0.3, volume: 0.02, minPulses: 5, maxPulses: 8, minPause: 1000, maxPause: 3000 },
  ];

  function scheduleCricket(config: CricketConfig) {
    if (!isPlaying || currentTheme !== 'sky') return;

    const pulses = config.minPulses + Math.floor(Math.random() * (config.maxPulses - config.minPulses + 1));
    // Slight pitch variation each time (±3%)
    const freq = config.freq * (0.97 + Math.random() * 0.06);
    // Slight volume variation
    const vol = config.volume * (0.6 + Math.random() * 0.4);

    cricketBurst(freq, config.pan, vol, pulses);

    const pause = config.minPause + Math.random() * (config.maxPause - config.minPause);
    const iv = setTimeout(() => scheduleCricket(config), pause);
    activeIntervals.push(iv as any);
  }

  // Stagger the start of each cricket
  crickets.forEach((config, i) => {
    const startDelay = i * 400 + Math.random() * 800;
    const iv = setTimeout(() => scheduleCricket(config), startDelay);
    activeIntervals.push(iv as any);
  });
}

// ─── Countdown beep (last 10 seconds) ───

let countdownScheduled = false;
let countdownTimeouts: ReturnType<typeof setTimeout>[] = [];

function cleanupCountdown() {
  countdownTimeouts.forEach(clearTimeout);
  countdownTimeouts = [];
  countdownScheduled = false;
}

/** Play a single countdown beep. Higher pitch and longer for the final beep (0 seconds left). */
function playBeep(isFinal: boolean) {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';

  if (isFinal) {
    // Final beep: higher pitch, longer, two-tone
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.12);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.setValueAtTime(0.35, now + 0.2);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  } else {
    // Regular countdown beep: short tick
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

/**
 * Called every second by the timer. When secondsRemaining <= 10,
 * plays countdown beeps. The beep at 0 is the "final" beep.
 */
export function tickCountdown(secondsRemaining: number) {
  if (secondsRemaining <= 10 && secondsRemaining >= 0) {
    playBeep(secondsRemaining === 0);
  }
}

// ─── Public API ───

const starters: Record<ThemeId, (ctx: AudioContext) => void> = {
  ocean: startOcean,
  forest: startForest,
  sky: startSky,
};

export function playAmbience(theme: ThemeId) {
  stopAmbience();
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  currentTheme = theme;
  isPlaying = true;
  starters[theme](ctx);
}

export function stopAmbience() {
  isPlaying = false;
  currentTheme = null;
  cleanup();
  cleanupCountdown();
}

export function isAmbiencePlaying(): boolean {
  return isPlaying;
}
