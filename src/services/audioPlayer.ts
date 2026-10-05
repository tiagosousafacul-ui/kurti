// Web Audio API Synth & Melodic Sound Engine for KurtMusic & App Audio
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentTrackId: string | null = null;
  private masterGain: GainNode | null = null;
  private tempo = 118;
  private step = 0;

  // Track presets with unique chord progressions and frequencies
  private presets: Record<string, { chords: number[][]; bass: number[]; wave: OscillatorType; bpm: number }> = {
    '1': { // "Savassi Tropical Glow" - Indie Pop
      chords: [[261.63, 329.63, 392.0], [293.66, 369.99, 440.0], [220.0, 261.63, 329.63], [349.23, 440.0, 523.25]],
      bass: [130.81, 146.83, 110.0, 174.61],
      wave: 'sine',
      bpm: 120,
    },
    '2': { // "Liberdade no Baile" - Funk & Pop Queer
      chords: [[311.13, 392.0, 466.16], [293.66, 349.23, 440.0], [261.63, 311.13, 392.0], [392.0, 493.88, 587.33]],
      bass: [155.56, 146.83, 130.81, 196.0],
      wave: 'triangle',
      bpm: 130,
    },
    '3': { // "Lua em Câncer" - Sáfica Acústica
      chords: [[261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0], [174.61, 220.0, 261.63, 329.63], [196.0, 246.94, 293.66, 392.0]],
      bass: [130.81, 110.0, 87.31, 98.0],
      wave: 'sine',
      bpm: 98,
    },
    '4': { // "Pajubá Neon Beat" - Hyperpop / Indie Dance
      chords: [[329.63, 415.30, 493.88], [277.18, 329.63, 415.30], [220.0, 277.18, 329.63], [246.94, 311.13, 369.99]],
      bass: [164.81, 138.59, 110.0, 123.47],
      wave: 'sawtooth',
      bpm: 134,
    },
    '5': { // "Coração Cerrado" - MPB Indie
      chords: [[293.66, 349.23, 440.0], [246.94, 293.66, 369.99], [220.0, 261.63, 329.63], [261.63, 329.63, 392.0]],
      bass: [146.83, 123.47, 110.0, 130.81],
      wave: 'triangle',
      bpm: 104,
    }
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTrack(trackId: string, onStep?: (step: number) => void) {
    this.initContext();
    if (this.isPlaying && this.currentTrackId === trackId) {
      return;
    }
    this.stop();

    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.step = 0;

    const preset = this.presets[trackId] || this.presets['1'];
    this.tempo = preset.bpm;
    const intervalMs = (60 / this.tempo / 2) * 1000; // eighth notes

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const chordIdx = Math.floor((this.step / 8) % preset.chords.length);
      const chord = preset.chords[chordIdx];
      const bassNote = preset.bass[chordIdx];

      // Play bass on beats
      if (this.step % 2 === 0) {
        this.triggerTone(bassNote, 'triangle', 0.28, 0.12);
      }

      // Play soft percussion / click
      if (this.step % 4 === 0) {
        this.triggerTone(80, 'sine', 0.2, 0.18); // Kick
      } else if (this.step % 4 === 2) {
        this.triggerNoise(0.08, 0.04); // Snare/clap
      }

      // Play arpeggio melody note
      const arpNote = chord[this.step % chord.length];
      this.triggerTone(arpNote, preset.wave, 0.15, 0.08);

      this.step++;
      if (onStep) {
        onStep(this.step % 16);
      }
    }, intervalMs);
  }

  private triggerTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio glitches safely
    }
  }

  private triggerNoise(duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
    } catch {
      // Ignore
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val * 0.3)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }
}

export const soundEngine = new SoundEngine();
