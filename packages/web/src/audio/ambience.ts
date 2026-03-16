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
  master.gain.value = 0.3;
  master.connect(ctx.destination);
  activeNodes.push(master);

  // Very soft background hiss (quiet night air)
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.03;
  noise.connect(lp).connect(airGain).connect(master);
  noise.start();
  activeNodes.push(noise, lp, airGain);

  // Cricket — a rapid on/off trill at a high frequency
  function createCricket(freq: number, trillRate: number, volume: number, pan: number) {
    // Tone source
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Rapid amplitude modulation to create the trill
    const trillOsc = ctx.createOscillator();
    trillOsc.type = 'square';
    trillOsc.frequency.value = trillRate;

    const trillGain = ctx.createGain();
    trillGain.gain.value = 0;

    // Use the square wave to modulate the gain
    const modGain = ctx.createGain();
    modGain.gain.value = volume;

    trillOsc.connect(trillGain.gain);
    osc.connect(trillGain).connect(modGain);

    // Stereo panning
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    modGain.connect(panner).connect(master);

    osc.start();
    trillOsc.start();
    activeNodes.push(osc, trillOsc, trillGain, modGain, panner);

    return modGain;
  }

  // Layer several crickets at slightly different pitches and rates
  const cricket1 = createCricket(4200, 28, 0.04, -0.6);
  const cricket2 = createCricket(3800, 32, 0.03, 0.5);
  const cricket3 = createCricket(4500, 25, 0.025, 0.2);

  // Slowly vary each cricket's volume so they fade in and out naturally
  function modulateCrickets() {
    const now = ctx.currentTime;
    const period = 4 + Math.random() * 4;

    [cricket1, cricket2, cricket3].forEach((c) => {
      const base = c.gain.value;
      const target = 0.015 + Math.random() * 0.04;
      c.gain.cancelScheduledValues(now);
      c.gain.setValueAtTime(base, now);
      c.gain.linearRampToValueAtTime(target, now + period);
    });
  }
  modulateCrickets();
  const cricketIv = setInterval(modulateCrickets, 5000);
  activeIntervals.push(cricketIv);
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
