import { afterEach, describe, expect, it, vi } from "vitest";

type FakeOscillator = {
  type: OscillatorType;
  frequency: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};

describe("key sounds", () => {
  afterEach(() => {
    vi.resetModules();
    Reflect.deleteProperty(window, "AudioContext");
  });

  it("uses a broadband transient for typing and a lower tone for errors", async () => {
    const oscillators: FakeOscillator[] = [];
    const sources: Array<{
      buffer: AudioBuffer | null;
      start: ReturnType<typeof vi.fn>;
    }> = [];

    class FakeAudioContext {
      state = "running";
      currentTime = 2;
      sampleRate = 44_100;
      destination = {};

      createBuffer() {
        return {
          getChannelData: () => new Float32Array(16),
        } as unknown as AudioBuffer;
      }

      createBufferSource() {
        const source = {
          buffer: null as AudioBuffer | null,
          connect: vi.fn(),
          start: vi.fn(),
        };
        sources.push(source);
        return source;
      }

      createOscillator() {
        const oscillator: FakeOscillator = {
          type: "sine",
          frequency: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
        oscillators.push(oscillator);
        return oscillator;
      }

      createGain() {
        return {
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        };
      }

      resume() {
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });

    const { playKeySound } = await import("./audio");
    playKeySound("type");
    const typeToneCount = oscillators.length;
    playKeySound("error");

    expect(sources).toHaveLength(3);
    expect(sources.every((source) => source.buffer !== null)).toBe(true);
    expect(typeToneCount).toBe(6);
    expect(oscillators).toHaveLength(9);
    const errorFrequency =
      oscillators[typeToneCount].frequency.setValueAtTime.mock.calls[0][0];
    expect(errorFrequency).toBe(786);
  });

  it("does nothing when sound is disabled", async () => {
    const createOscillator = vi.fn();
    const createBufferSource = vi.fn();
    class UnusedAudioContext {
      createOscillator = createOscillator;
      createBufferSource = createBufferSource;
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: UnusedAudioContext,
    });

    const { playKeySound } = await import("./audio");
    playKeySound("type", false);

    expect(createOscillator).not.toHaveBeenCalled();
    expect(createBufferSource).not.toHaveBeenCalled();
  });
});
