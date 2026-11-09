import {
  DEFAULT_SOUND_PACK_ID,
  getSoundPack,
  type KeySoundKind,
  type SoundTone,
} from "./soundPacks";

export type { KeySoundKind } from "./soundPacks";

type BrowserAudioContext = typeof AudioContext;

let audioContext: AudioContext | null = null;
let clickBuffer: AudioBuffer | null = null;
const SAMPLE_POOL_SIZE = 6;
const samplePools = new Map<
  string,
  { players: HTMLAudioElement[]; nextIndex: number }
>();

export function unlockKeySounds(packId = DEFAULT_SOUND_PACK_ID): void {
  const context = getAudioContext();
  if (context?.state === "suspended") {
    void context.resume().catch(() => undefined);
  }

  const sample = getSoundPack(packId).sampleAudio?.type;
  if (sample) {
    getSamplePool(sample);
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
  tone: SoundTone,
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

function getSamplePool(path: string) {
  const existing = samplePools.get(path);
  if (existing) {
    return existing;
  }

  const url = new URL(path, document.baseURI).href;
  const pool = {
    players: Array.from({ length: SAMPLE_POOL_SIZE }, () => {
      const player = new Audio(url);
      player.preload = "auto";
      player.volume = 0.8;
      player.load();
      return player;
    }),
    nextIndex: 0,
  };
  samplePools.set(path, pool);
  return pool;
}

function playSample(path: string): void {
  if (typeof document === "undefined") {
    return;
  }

  const pool = getSamplePool(path);
  const player = pool.players[pool.nextIndex];
  pool.nextIndex = (pool.nextIndex + 1) % pool.players.length;
  player.currentTime = 0;
  const result = player.play();
  if (result) {
    void result.catch(() => undefined);
  }
}

export function playKeySound(
  kind: KeySoundKind,
  enabled = true,
  packId = DEFAULT_SOUND_PACK_ID,
): void {
  if (!enabled) {
    return;
  }

  const pack = getSoundPack(packId);
  const sample = pack.sampleAudio?.[kind];
  if (sample) {
    playSample(sample);
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume().catch(() => undefined);
  }

  const recipe = pack.sounds[kind];
  const startAt = context.currentTime + 0.002;

  for (const noise of recipe.noises) {
    scheduleNoise(
      context,
      startAt + (noise.delay ?? 0),
      noise.volume,
    );
  }

  for (const tone of recipe.tones) {
    scheduleTone(context, tone, startAt);
  }
}
