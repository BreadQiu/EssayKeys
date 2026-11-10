import {
  DEFAULT_SOUND_PACK_ID,
  getSoundPack,
  type KeySoundKind,
} from "./soundPacks";

export type { KeySoundKind } from "./soundPacks";

const INITIAL_SAMPLE_POOL_SIZE = 6;
const MAX_SAMPLE_POOL_SIZE = 16;
const samplePools = new Map<
  string,
  { url: string; players: HTMLAudioElement[]; nextIndex: number }
>();

export function unlockKeySounds(packId = DEFAULT_SOUND_PACK_ID): void {
  const sampleAudio = getSoundPack(packId).sampleAudio;
  getSamplePool(sampleAudio.type);
  getSamplePool(sampleAudio.error);
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
