/**
 * Web Audio API Procedural Ambient Sound Generator
 * Generates relaxing soundscapes (Gentle Rain, Ocean Waves, Campfire, Brown Noise)
 * with zero external audio assets, zero latency, and zero network usage.
 */

export type SoundscapeType = 'off' | 'rain' | 'waves' | 'fire' | 'brown_noise';

let ambientCtx: AudioContext | null = null;
let activeSourceNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let intervalId: any = null;

function getAmbientContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ambientCtx) {
    const AudioCtxClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      ambientCtx = new AudioCtxClass();
    }
  }
  if (ambientCtx && ambientCtx.state === 'suspended') {
    ambientCtx.resume();
  }
  return ambientCtx;
}

/**
 * Generate pink/brown noise buffer for natural rain and waves
 */
function createNoiseBuffer(ctx: AudioContext, seconds = 5): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brown noise filter (integrated white noise)
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // Gain compensation
  }
  return buffer;
}

export const AmbientSoundEngine = {
  currentSound: 'off' as SoundscapeType,
  volume: 0.35,

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (gainNode && ambientCtx) {
      try {
        gainNode.gain.linearRampToValueAtTime(0.001, ambientCtx.currentTime + 0.5);
      } catch {}
    }

    setTimeout(() => {
      try {
        if (activeSourceNode) {
          (activeSourceNode as any).stop?.();
          activeSourceNode.disconnect();
          activeSourceNode = null;
        }
      } catch {}
      this.currentSound = 'off';
    }, 500);
  },

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (gainNode && ambientCtx) {
      gainNode.gain.setValueAtTime(this.volume, ambientCtx.currentTime);
    }
  },

  play(type: SoundscapeType) {
    this.stop();
    if (type === 'off') return;

    const ctx = getAmbientContext();
    if (!ctx) return;

    setTimeout(() => {
      const now = ctx.currentTime;
      gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(this.volume, now + 1.2);

      filterNode = ctx.createBiquadFilter();

      const noiseBuffer = createNoiseBuffer(ctx, 6);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      if (type === 'rain') {
        // Rain: bandpass filter around mid frequencies with random raindrop crackles
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(1200, now);

        noiseSource.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        noiseSource.start(now);
        activeSourceNode = noiseSource;

        // Randomized raindrop clicks
        intervalId = setInterval(() => {
          if (!ambientCtx || this.currentSound !== 'rain') return;
          try {
            const dropOsc = ambientCtx.createOscillator();
            const dropGain = ambientCtx.createGain();
            const dropTime = ambientCtx.currentTime;

            dropOsc.type = 'triangle';
            dropOsc.frequency.setValueAtTime(3000 + Math.random() * 2000, dropTime);
            dropOsc.frequency.exponentialRampToValueAtTime(800, dropTime + 0.03);

            dropGain.gain.setValueAtTime(this.volume * 0.15, dropTime);
            dropGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.04);

            dropOsc.connect(dropGain);
            dropGain.connect(ambientCtx.destination);
            dropOsc.start(dropTime);
            dropOsc.stop(dropTime + 0.05);
          } catch {}
        }, 120);
      } else if (type === 'waves') {
        // Ocean Waves: low frequency with oscillating volume sweep
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(600, now);

        // LFO for wave swelling
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, now); // 8-second wave cycle
        lfoGain.gain.setValueAtTime(this.volume * 0.5, now);

        lfo.connect(lfoGain.gain);
        noiseSource.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseSource.start(now);
        lfo.start(now);
        activeSourceNode = noiseSource;
      } else if (type === 'fire') {
        // Campfire: warm low rumble with sporadic wood crackles
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(450, now);

        noiseSource.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        noiseSource.start(now);
        activeSourceNode = noiseSource;

        intervalId = setInterval(() => {
          if (!ambientCtx || this.currentSound !== 'fire') return;
          if (Math.random() > 0.4) {
            try {
              const crackle = ambientCtx.createOscillator();
              const cGain = ambientCtx.createGain();
              const cTime = ambientCtx.currentTime;

              crackle.type = 'square';
              crackle.frequency.setValueAtTime(1500 + Math.random() * 1200, cTime);
              cGain.gain.setValueAtTime(this.volume * 0.25, cTime);
              cGain.gain.exponentialRampToValueAtTime(0.001, cTime + 0.02);

              crackle.connect(cGain);
              cGain.connect(ambientCtx.destination);
              crackle.start(cTime);
              crackle.stop(cTime + 0.03);
            } catch {}
          }
        }, 180);
      } else if (type === 'brown_noise') {
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(350, now);

        noiseSource.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        noiseSource.start(now);
        activeSourceNode = noiseSource;
      }

      this.currentSound = type;
    }, 100);
  },
};
