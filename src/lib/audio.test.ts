import { afterEach, describe, expect, it, vi } from "vitest";

function createAudioStub() {
  const constructed: string[] = [];
  const loaded: string[] = [];
  const played: string[] = [];

  class FakeAudio {
    preload = "";
    volume = 1;
    currentTime = 0;
    paused = true;
    ended = false;

    constructor(public src: string) {
      constructed.push(src);
    }

    load() {
      loaded.push(this.src);
    }

    play() {
      this.paused = false;
      played.push(this.src);
      return Promise.resolve();
    }
  }

  vi.stubGlobal("Audio", FakeAudio);
  return { constructed, loaded, played };
}

describe("key sounds", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, "AudioContext");
  });

  it("plays the paired sample files for the selected pack", async () => {
    const { played } = createAudioStub();
    const { playKeySound } = await import("./audio");

    playKeySound("type", true, "butter-thock");
    playKeySound("error", true, "butter-thock");

    expect(played[0]).toContain(
      "/audio/essaykeys/butter-thock-type.mp3",
    );
    expect(played[1]).toContain(
      "/audio/essaykeys/butter-thock-error.mp3",
    );
  });

  it("preloads both samples in a pair when sounds are unlocked", async () => {
    const { constructed, loaded, played } = createAudioStub();
    const { unlockKeySounds } = await import("./audio");

    unlockKeySounds("spring-boing");

    expect(constructed).toHaveLength(12);
    expect(loaded).toHaveLength(12);
    expect(
      loaded.some((path) => path.includes("spring-boing-type.mp3")),
    ).toBe(true);
    expect(
      loaded.some((path) => path.includes("spring-boing-error.mp3")),
    ).toBe(true);
    expect(played).toHaveLength(0);
  });

  it("does nothing when sound is disabled", async () => {
    const { constructed } = createAudioStub();
    const { playKeySound } = await import("./audio");

    playKeySound("type", false);

    expect(constructed).toHaveLength(0);
  });

  it("expands the player pool instead of cutting off rapid key presses", async () => {
    const { constructed } = createAudioStub();
    const { playKeySound } = await import("./audio");

    for (let index = 0; index < 20; index += 1) {
      playKeySound("type", true, "edclub");
    }

    expect(constructed).toHaveLength(16);
  });

  it("starts a separate sound source for every rapid key press", async () => {
    const starts: Array<ReturnType<typeof vi.fn>> = [];

    class FakeAudioContext {
      state: AudioContextState = "running";
      currentTime = 0;
      sampleRate = 44_100;
      destination = {};

      createBufferSource() {
        const start = vi.fn();
        starts.push(start);
        return {
          buffer: null as AudioBuffer | null,
          connect: vi.fn(),
          start,
        };
      }

      async decodeAudioData() {
        return { duration: 0.16 } as AudioBuffer;
      }

      resume() {
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      })),
    );

    const { playKeySound, unlockKeySounds } = await import("./audio");
    await unlockKeySounds("butter-thock");

    for (let index = 0; index < 100; index += 1) {
      playKeySound("type", true, "butter-thock");
    }

    expect(starts).toHaveLength(100);
    expect(starts.every((start) => start.mock.calls.length === 1)).toBe(true);
  });

  it("uses the exact EdClub sample files for its reference pack", async () => {
    const { played } = createAudioStub();
    const { playKeySound } = await import("./audio");

    playKeySound("type", true, "edclub");
    playKeySound("error", true, "edclub");

    expect(played[0]).toContain("/audio/edclub/typewriter.mp3");
    expect(played[1]).toContain("/audio/edclub/error.mp3");
  });
});
