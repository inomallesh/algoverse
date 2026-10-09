// Web Audio API Synthesizer for educational audio feedback
class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(val, minVal = 5, maxVal = 100, duration = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Map value between 200Hz and 880Hz
      const minFreq = 220;
      const maxFreq = 880;
      const freq = minFreq + ((val - minVal) / Math.max(1, (maxVal - minVal))) * (maxFreq - minFreq);

      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked before user interaction
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

window.soundSynth = new SoundSynthesizer();
