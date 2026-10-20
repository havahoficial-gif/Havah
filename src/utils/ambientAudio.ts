/**
 * HAVAH Generative Ambient Worship Audio Engine
 * Creates a highly professional, infinite, flowing acoustic worship atmosphere.
 * Uses a generative pentatonic algorithms to synthesize lush, cinematic church keyboard pads
 * and soft, cascading acoustic piano notes that never clash, sounding deeply sacred, serene,
 * and high-end — completely avoiding simple monophonic melodies.
 */

export type SoundscapeType = 'piano' | 'off';

interface ChordDefinition {
  name: string;
  padFreqs: number[];   // Deep warming strings / pads
  pianoNotes: number[]; // Frequencies for elegant cascading piano notes
}

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'off';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.35;
  private preDuckVolume: number = 0.35;
  private isDucked: boolean = false;
  private currentChordIndex = 0;
  private onSongChangeCallback: ((title: string) => void) | null = null;

  // Premium, lush, extended chords for contemporary worship (G, C, Em, D)
  private chords: ChordDefinition[] = [
    {
      name: 'Atmósfera de Adoración I',
      // Gsus2 (rich, open, hopeful)
      padFreqs: [98.00, 146.83, 196.00, 293.66],
      pianoNotes: [196.00, 220.00, 246.94, 293.66, 392.00, 440.00, 493.88, 587.33]
    },
    {
      name: 'Atmósfera de Adoración II',
      // Csus2 (peaceful, flowing, deep)
      padFreqs: [130.81, 196.00, 261.63, 329.63],
      pianoNotes: [261.63, 293.66, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99]
    },
    {
      name: 'Atmósfera de Adoración III',
      // Em9 (reflective, infinite, warm)
      padFreqs: [82.41, 146.83, 164.81, 246.94],
      pianoNotes: [164.81, 196.00, 246.94, 293.66, 329.63, 392.00, 493.88, 587.33, 659.25]
    },
    {
      name: 'Atmósfera de Adoración IV',
      // Dsus4 (triumphant, majestic)
      padFreqs: [110.00, 146.83, 220.00, 293.66],
      pianoNotes: [220.00, 246.94, 293.66, 369.99, 440.00, 493.88, 587.33, 739.99]
    }
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public duck() {
    if (this.currentType === 'off' || !this.ctx || !this.masterGain) return;
    if (!this.isDucked) {
      this.preDuckVolume = this.volume;
      this.isDucked = true;
    }
    const duckedVol = Math.max(0.06, this.preDuckVolume * 0.28);
    this.masterGain.gain.setTargetAtTime(duckedVol, this.ctx.currentTime, 0.3);
  }

  public unduck() {
    if (this.currentType === 'off' || !this.ctx || !this.masterGain) return;
    if (this.isDucked) {
      this.isDucked = false;
      this.masterGain.gain.setTargetAtTime(this.preDuckVolume, this.ctx.currentTime, 0.6);
    }
  }

  public getSoundscape(): SoundscapeType {
    return this.currentType;
  }

  public getActiveSongTitle(lang: 'es' | 'en' = 'es'): string {
    if (this.currentType === 'off') return '';
    const chord = this.chords[this.currentChordIndex];
    return chord ? (lang === 'es' ? chord.name : 'Worship Atmosphere') : '';
  }

  public setOnSongChange(callback: (title: string) => void) {
    this.onSongChangeCallback = callback;
  }

  public play(type: SoundscapeType) {
    if (type === this.currentType) return;
    this.stop();

    if (type === 'off') return;

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentType = type;
    this.startGenerativeSession();
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        window.clearInterval(node);
        window.clearTimeout(node);
      } else if ('stop' in node) {
        try {
          (node as any).stop();
        } catch {}
      } else if ('disconnect' in node) {
        try {
          node.disconnect();
        } catch {}
      }
    });
    this.activeNodes = [];
    this.currentType = 'off';
  }

  /**
   * Generates continuous, high-definition background ambient pads
   * and plays elegant, flowing pentatonic piano notes.
   */
  private startGenerativeSession() {
    if (!this.ctx || !this.masterGain || this.currentType !== 'piano') return;

    let activePadNodes: (AudioNode)[] = [];

    const playWorshipChordAndPads = () => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'piano') return;

      const chord = this.chords[this.currentChordIndex];
      if (this.onSongChangeCallback) {
        this.onSongChangeCallback(chord.name);
      }

      const now = this.ctx.currentTime;
      const transitionTime = 9.0; // Slow, luxurious 9 seconds per pad movement

      // Stop old pads gently
      const oldNodes = [...activePadNodes];
      activePadNodes = [];

      oldNodes.forEach((node) => {
        if ('stop' in node) {
          try {
            (node as any).stop(now + 2.0); // Smooth 2s fade out
          } catch {}
        }
      });

      // Play new warm strings / pad choir
      chord.padFreqs.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + 4.0);
        filter.frequency.exponentialRampToValueAtTime(320, now + transitionTime);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 3.0); // 3-second long lush attack
        gain.gain.exponentialRampToValueAtTime(0.0001, now + transitionTime + 1.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        
        activePadNodes.push(osc, filter, gain);
        this.activeNodes.push(osc, filter, gain);
      });

      // Advance to next chord
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

      // Schedule next chord pad sweep
      const padTimer = window.setTimeout(playWorshipChordAndPads, transitionTime * 1000 - 1500); // 1.5s beautiful overlap
      this.activeNodes.push(padTimer);
    };

    // Play elegant, spontaneous piano notes within the current active scale
    const playSpontaneousPianoNotes = () => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'piano') return;

      const chord = this.chords[this.currentChordIndex];
      const now = this.ctx.currentTime;

      // Select 1 or 2 elegant notes to play simultaneously
      const notesToPlay = Math.random() > 0.65 ? 2 : 1;

      for (let i = 0; i < notesToPlay; i++) {
        const randomFreq = chord.pianoNotes[Math.floor(Math.random() * chord.pianoNotes.length)];
        
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(randomFreq, now);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(randomFreq * 0.5, now); // Add acoustic cabinet wood resonance

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1250, now);

        gain.gain.setValueAtTime(0, now);
        // Soft touch piano attack (35ms)
        gain.gain.linearRampToValueAtTime(Math.random() * 0.08 + 0.05, now + 0.035);
        // Extremely long beautiful acoustic ring and decay (5 seconds)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 5.2);
        subOsc.stop(now + 5.2);

        this.activeNodes.push(osc, subOsc, filter, gain);
      }

      // Schedule next elegant, non-clashing piano note in a randomized beautiful human spacing (1.2s to 3.5s)
      const nextDelay = Math.random() * 2300 + 1200;
      const pianoTimer = window.setTimeout(playSpontaneousPianoNotes, nextDelay);
      this.activeNodes.push(pianoTimer);
    };

    // Start both parallel professional elements
    playWorshipChordAndPads();
    playSpontaneousPianoNotes();
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
