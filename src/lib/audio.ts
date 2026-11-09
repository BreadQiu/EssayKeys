export type KeySoundKind = "type" | "error";

type BrowserAudioContext = typeof AudioContext;
type Tone = {
  wave: OscillatorType;
  startFrequency: number;
  endFrequency: number;
  duration: number;
  volume: number;
  attack: number;
  delay?: number;
};

let audioContext: AudioContext | null = null;
let clickBuffer: AudioBuffer | null = null;

export function unlockKeySounds(): void {
  const context = getAudioContext();
  if (context?.state === "suspended") {
    void context.resume().catch(() => undefined);
  }
}

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

function getClickBuffer(context: AudioContext): AudioBuffer {
  if (clickBuffer) {
    return clickBuffer;
  }

  const durationSeconds = 0.05;
  const sampleCount = Math.ceil(context.sampleRate * durationSeconds);
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let previousNoise = 0;
  let previousFiltered = 0;
  let randomState = 0x4f1bbcdc;

  for (let index = 0; index < sampleCount; index += 1) {
    randomState = (1664525 * randomState + 1013904223) >>> 0;
    const noise = (randomState / 0xffffffff) * 2 - 1;
    const highPassed =
      0.94 * (previousFiltered + noise - previousNoise);
    previousNoise = noise;
    previousFiltered = highPassed;
    const time = index / context.sampleRate;
    const envelope =
      (1 - Math.exp(-time / 0.0008)) * Math.exp(-time / 0.0065);
    samples[index] = highPassed * envelope;
  }

  clickBuffer = buffer;
  return buffer;
}

function scheduleTone(
  context: AudioContext,
  tone: Tone,
  startAt: number,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const toneStart = startAt + (tone.delay ?? 0);

  oscillator.type = tone.wave;
  oscillator.frequency.setValueAtTime(tone.startFrequency, toneStart);
  oscillator.frequency.exponentialRampToValueAtTime(
    tone.endFrequency,
    toneStart + tone.duration * 0.72,
  );

  gain.gain.setValueAtTime(0.0001, toneStart);
  gain.gain.exponentialRampToValueAtTime(tone.volume, toneStart + tone.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, toneStart + tone.duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(toneStart);
  oscillator.stop(toneStart + tone.duration + 0.01);
}

function scheduleNoise(
  context: AudioContext,
  startAt: number,
  volume: number,
): void {
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = getClickBuffer(context);
  gain.gain.setValueAtTime(volume, startAt);
  source.connect(gain);
  gain.connect(context.destination);
  source.start(startAt);
}

export function playKeySound(
  kind: KeySoundKind,
  enabled = true,
): void {
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

  const startAt = context.currentTime + 0.002;

  if (kind === "error") {
    scheduleNoise(context, startAt, 0.01);
    scheduleTone(
      context,
      {
        wave: "sine",
        startFrequency: 786,
        endFrequency: 782,
        duration: 0.25,
        volume: 0.038,
        attack: 0.008,
      },
      startAt,
    );
    scheduleTone(
      context,
      {
        wave: "triangle",
        startFrequency: 792,
        endFrequency: 788,
        duration: 0.205,
        volume: 0.009,
        attack: 0.012,
      },
      startAt,
    );
    scheduleTone(
      context,
      {
        wave: "sine",
        startFrequency: 98,
        endFrequency: 92,
        duration: 0.07,
        volume: 0.006,
        attack: 0.003,
      },
      startAt,
    );
    return;
  }

  scheduleNoise(context, startAt, 0.025);
  scheduleNoise(context, startAt + 0.018, 0.36);
  for (const tone of [
    {
      wave: "triangle",
      startFrequency: 6_650,
      endFrequency: 5_200,
      duration: 0.026,
      volume: 0.02,
      attack: 0.001,
      delay: 0.015,
    },
    {
      wave: "sine",
      startFrequency: 4_850,
      endFrequency: 2_350,
      duration: 0.052,
      volume: 0.034,
      attack: 0.0015,
      delay: 0.018,
    },
    {
      wave: "sine",
      startFrequency: 2_688,
      endFrequency: 2_400,
      duration: 0.026,
      volume: 0.012,
      attack: 0.001,
      delay: 0.009,
    },
    {
      wave: "triangle",
      startFrequency: 2_300,
      endFrequency: 950,
      duration: 0.12,
      volume: 0.011,
      attack: 0.002,
      delay: 0.03,
    },
    {
      wave: "sine",
      startFrequency: 944,
      endFrequency: 900,
      duration: 0.2,
      volume: 0.005,
      attack: 0.004,
      delay: 0.04,
    },
    {
      wave: "triangle",
      startFrequency: 544,
      endFrequency: 470,
      duration: 0.23,
      volume: 0.003,
      attack: 0.004,
      delay: 0.045,
    },
  ] satisfies Tone[]) {
    scheduleTone(context, tone, startAt);
  }
}
