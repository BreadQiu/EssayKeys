import {
  DEFAULT_SOUND_PACK_ID,
  getSoundPack,
  type KeySoundKind,
} from "./soundPacks";

export type { KeySoundKind } from "./soundPacks";

type BrowserAudioContext = typeof AudioContext;

const INITIAL_SAMPLE_POOL_SIZE = 6;
const MAX_SAMPLE_POOL_SIZE = 16;
let audioContext: AudioContext | null = null;
const audioBuffers = new Map<string, AudioBuffer>();
const audioBufferLoads = new Map<string, Promise<AudioBuffer>>();
const samplePools = new Map<
  string,
  { url: string; players: HTMLAudioElement[]; nextIndex: number }
>();

export async function unlockKeySounds(
  packId = DEFAULT_SOUND_PACK_ID,
): Promise<void> {
  const sampleAudio = getSoundPack(packId).sampleAudio;
  getSamplePool(sampleAudio.type);
  getSamplePool(sampleAudio.error);

  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    await context.resume().catch(() => undefined);
  }

  await Promise.all([
    loadAudioBuffer(context, sampleAudio.type),
    loadAudioBuffer(context, sampleAudio.error),
  ]).catch(() => undefined);
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

function loadAudioBuffer(
  context: AudioContext,
  path: string,
): Promise<AudioBuffer> {
  const loaded = audioBuffers.get(path);
  if (loaded) {
    return Promise.resolve(loaded);
  }

  const existingLoad = audioBufferLoads.get(path);
  if (existingLoad) {
    return existingLoad;
  }

  const url = new URL(path, document.baseURI).href;
  const load = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load audio: ${path}`);
      }
      return response.arrayBuffer();
    })
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      audioBuffers.set(path, buffer);
      return buffer;
    })
    .catch((error: unknown) => {
      audioBufferLoads.delete(path);
      throw error;
    });

  audioBufferLoads.set(path, load);
  return load;
}

function getSamplePool(path: string) {
  const existing = samplePools.get(path);
  if (existing) {
    return existing;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const url = new URL(path, document.baseURI).href;
  const pool = {
    url,
    players: Array.from(
      { length: INITIAL_SAMPLE_POOL_SIZE },
      () => createPlayer(url),
    ),
    nextIndex: 0,
  };
  samplePools.set(path, pool);
  return pool;
}

function createPlayer(url: string): HTMLAudioElement {
  const player = new Audio(url);
  player.preload = "auto";
  player.volume = 0.8;
  player.load();
  return player;
}

function takeAvailablePlayer(pool: {
  url: string;
  players: HTMLAudioElement[];
  nextIndex: number;
}): HTMLAudioElement {
  const idlePlayer = pool.players.find(
    (player) => player.paused || player.ended,
  );
  if (idlePlayer) {
    return idlePlayer;
  }

  if (pool.players.length < MAX_SAMPLE_POOL_SIZE) {
    const player = createPlayer(pool.url);
    pool.players.push(player);
    return player;
  }

  const player = pool.players[pool.nextIndex];
  pool.nextIndex = (pool.nextIndex + 1) % pool.players.length;
  return player;
}

function playSample(path: string): void {
  const context = getAudioContext();
  const buffer = context ? audioBuffers.get(path) : null;
  if (context && buffer) {
    if (context.state === "suspended") {
      void context.resume().catch(() => undefined);
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime + 0.002);
    return;
  }

  if (context) {
    void loadAudioBuffer(context, path).catch(() => undefined);
  }

  const pool = getSamplePool(path);
  if (!pool) {
    return;
  }

  const player = takeAvailablePlayer(pool);
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

  playSample(getSoundPack(packId).sampleAudio[kind]);
}
