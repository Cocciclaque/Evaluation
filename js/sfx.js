/* ============================================
   🔊 PEAKDLE - Sound Effects (Web Audio API)
   ============================================ */

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3; // Volume maître
    this.enabled = true;
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  }

  playBeep(frequency = 800, duration = 100, volume = 0.3) {
    if (!this.enabled) return;
    this.initAudioContext();

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = frequency;
    osc.type = "sine";

    gain.gain.setValueAtTime(volume * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration / 1000
    );

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  // Son de hover (petit beep aigüe)
  hoverSound() {
    this.playBeep(600, 80, 0.2);
  }

  // Son de click (beep moyen)
  clickSound() {
    this.playBeep(800, 120, 0.3);
  }

  // Son de victoire (montée de notes)
  victorySound() {
    if (!this.enabled) return;
    this.initAudioContext();

    const ctx = this.audioContext;
    const notes = [523, 659, 784]; // Do, Mi, Sol (C5, E5, G5)
    let time = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const startTime = time + index * 0.1;
      gain.gain.setValueAtTime(0.4 * this.masterVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Son de défaite (descente de notes)
  defeatSound() {
    if (!this.enabled) return;
    this.initAudioContext();

    const ctx = this.audioContext;
    const notes = [523, 392, 262]; // Do, Sol, Do grave (C5, G4, C4)
    let time = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const startTime = time + index * 0.1;
      gain.gain.setValueAtTime(0.4 * this.masterVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Son d'une tentative incorrecte (buzz court)
  wrongGuessSound() {
    if (!this.enabled) return;
    this.initAudioContext();

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    osc.type = "square";

    gain.gain.setValueAtTime(0.3 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  // Son de transition/navigation
  navigationSound() {
    this.playBeep(440, 100, 0.25);
  }

  // Son pour les cartes du jeu (entrée)
  cardEnterSound() {
    this.playBeep(500, 60, 0.15);
  }

  // Son pour les cartes du jeu (sortie)
  cardLeaveSound() {
    this.playBeep(700, 50, 0.1);
  }

  // Son de suggestion (beep subtil)
  suggestionSound() {
    this.playBeep(550, 40, 0.15);
  }

  // Son d'une tentative correcte partielle (intéressant)
  correctPartialSound() {
    if (!this.enabled) return;
    this.initAudioContext();

    const ctx = this.audioContext;
    const notes = [587, 659]; // Ré, Mi (D5, E5)
    let time = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const startTime = time + index * 0.08;
      gain.gain.setValueAtTime(0.2 * this.masterVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Toggle son activé/désactivé
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Instance globale
const sfx = new SoundEffects();
