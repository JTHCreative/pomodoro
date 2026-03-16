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
  rustleGain.gain.value = 0.06;
  noise.connect(bp).connect(rustleGain).connect(master);
  noise.start();
  activeNodes.push(noise, bp, rustleGain);

  // Bird chirps — schedule random chirps
  function chirp() {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const chirpGain = ctx.createGain();

    // Random bird pitch
    const baseFreq = 1800 + Math.random() * 2000;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * (1 + Math.random() * 0.3), now + 0.06);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, now + 0.12);

    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    chirpGain.gain.linearRampToValueAtTime(0, now + 0.12);

    osc.connect(chirpGain).connect(master);
    osc.start(now);
    osc.stop(now + 0.15);

    // Sometimes do a double chirp
    if (Math.random() > 0.5) {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      const t2 = now + 0.18;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.1, t2);
      osc2.frequency.linearRampToValueAtTime(baseFreq * 1.3, t2 + 0.05);
      g2.gain.setValueAtTime(0, t2);
      g2.gain.linearRampToValueAtTime(0.1, t2 + 0.01);
      g2.gain.linearRampToValueAtTime(0, t2 + 0.1);
      osc2.connect(g2).connect(master);
      osc2.start(t2);
      osc2.stop(t2 + 0.12);
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

// ─── Sky: gentle wind with soft whistling ───
function startSky(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0.3;
  master.connect(ctx.destination);
  activeNodes.push(master);

  // Base wind — filtered noise with slow modulation
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 600;
  lp.Q.value = 0.8;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.15;
  noise.connect(lp).connect(windGain).connect(master);
  noise.start();
  activeNodes.push(noise, lp, windGain);

  // Wind modulation — slow swells
  function modulateWind() {
    const now = ctx.currentTime;
    const period = 5 + Math.random() * 4;
    windGain.gain.cancelScheduledValues(now);
    windGain.gain.setValueAtTime(windGain.gain.value, now);
    windGain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.14, now + period * 0.5);
    windGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.06, now + period);
  }
  modulateWind();
  const windIv = setInterval(modulateWind, 6000);
  activeIntervals.push(windIv);

  // High whistle layer — very faint
  const noise2 = ctx.createBufferSource();
  noise2.buffer = createNoiseBuffer(ctx, 4);
  noise2.loop = true;
  const hp = ctx.createBiquadFilter();
  hp.type = 'bandpass';
  hp.frequency.value = 2000;
  hp.Q.value = 5;
  const whistleGain = ctx.createGain();
  whistleGain.gain.value = 0.02;
  noise2.connect(hp).connect(whistleGain).connect(master);
  noise2.start();
  activeNodes.push(noise2, hp, whistleGain);

  // Whistle swell
  function modulateWhistle() {
    const now = ctx.currentTime;
    const period = 8 + Math.random() * 6;
    whistleGain.gain.cancelScheduledValues(now);
    whistleGain.gain.setValueAtTime(whistleGain.gain.value, now);
    whistleGain.gain.linearRampToValueAtTime(0.01 + Math.random() * 0.03, now + period * 0.5);
    whistleGain.gain.linearRampToValueAtTime(0.005, now + period);
  }
  modulateWhistle();
  const whistleIv = setInterval(modulateWhistle, 10000);
  activeIntervals.push(whistleIv);
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
}

export function isAmbiencePlaying(): boolean {
  return isPlaying;
}
