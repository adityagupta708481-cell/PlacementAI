/**
 * Ultra-subtle acoustic tactile feedback for theme toggling.
 * Synthesized entirely via native Web Audio API — 0 dependencies, 0 network requests.
 * Audio frequency and harmonics are tuned for a high-end physical switch aesthetic.
 */
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playThemeSound(theme) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Subtle acoustic frequency design:
    // Light mode: Warm golden chime (587Hz -> 880Hz)
    // Dark mode: Crisp cyberpunk tactile snap (440Hz -> 330Hz)
    // System mode: Harmonic dual-tone (523Hz -> 659Hz)
    let startFreq = 480;
    let endFreq = 360;

    if (theme === 'light') {
      startFreq = 540;
      endFreq = 820;
    } else if (theme === 'system') {
      startFreq = 520;
      endFreq = 660;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06);

    // Whisper volume (0.028) so it feels tactfully physical rather than loud or annoying
    gain.gain.setValueAtTime(0.028, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  } catch (_) {
    // Fail silently if browser audio policy blocks autoplay without user interaction
  }
}
