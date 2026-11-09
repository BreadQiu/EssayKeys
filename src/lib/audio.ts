export type KeySoundKind = "type" | "delete";

type BrowserAudioContext = typeof AudioContext;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as typeof window & {
      webkitAudioContext?: BrowserAudioContext;
    }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  try {
    audioContext ??= new AudioContextConstructor();
    return audioContext;
  } catch {
    return null;
  }
}

export function playKeySound(kind: KeySoundKind, enabled = true): void {
  if (!enabled) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume().catch(() => undefined);
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const isTyping = kind === "type";
  const startFrequency = isTyping ? 1_180 + Math.random() * 180 : 390;
  const endFrequency = isTyping ? 820 : 245;
  const duration = isTyping ? 0.052 : 0.075;
  const peakVolume = isTyping ? 0.045 : 0.035;

  oscillator.type = isTyping ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    endFrequency,
    now + duration * 0.7,
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakVolume, now + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.01);
}
