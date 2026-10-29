let ctx: AudioContext | null = null;
let currentVolume = 0.5;

export function setSoundVolume(v: number) {
  currentVolume = Math.max(0, Math.min(1, v));
}

export function playTone(
  kind: "place" | "capture" | "mill" | "win" | "lose" | "tick" | "click" | "error",
  volumeMultiplier: number = 1,
) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    ctx ??= new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;
    const vol = currentVolume * volumeMultiplier;
    if (vol <= 0.001) return;

    if (kind === "place") {
      // Warm stone click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
      gain.gain.setValueAtTime(vol * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (kind === "capture") {
      // Crisp break/capture snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.15);
      gain.gain.setValueAtTime(vol * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } else if (kind === "mill") {
      // Melodic glowing chime arpeggio (C5 - E5 - G5 - C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const delay = idx * 0.06;
        gain.gain.setValueAtTime(vol * 0.35, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.35);
        osc.connect(gain).connect(ctx!.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.36);
      });
    } else if (kind === "win") {
      // Celebratory fanfare
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.5 },
      ];
      let offset = 0;
      notes.forEach((n) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.value = n.f;
        gain.gain.setValueAtTime(vol * 0.45, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + n.d);
        osc.connect(gain).connect(ctx!.destination);
        osc.start(t + offset);
        osc.stop(t + offset + n.d + 0.05);
        offset += n.d * 0.85;
      });
    } else if (kind === "lose") {
      // Soft minor resolution
      const notes = [440, 415.3, 392, 349.23];
      notes.forEach((f, i) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        const delay = i * 0.12;
        gain.gain.setValueAtTime(vol * 0.25, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);
        osc.connect(gain).connect(ctx!.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.26);
      });
    } else if (kind === "tick") {
      // Woodblock clock tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.03);
      gain.gain.setValueAtTime(vol * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.035);
    } else if (kind === "click") {
      // UI button click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, t);
      gain.gain.setValueAtTime(vol * 0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } else if (kind === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, t);
      gain.gain.setValueAtTime(vol * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    }
  } catch {
    // Audio unavailable in background or strict browser policy
  }
}
