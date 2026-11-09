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

  it("schedules distinct bright sounds for typing and deleting", async () => {
    const oscillators: FakeOscillator[] = [];

    class FakeAudioContext {
      state = "running";
      currentTime = 2;
      destination = {};

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
    playKeySound("delete");

    expect(oscillators).toHaveLength(2);
    const typeFrequency =
      oscillators[0].frequency.setValueAtTime.mock.calls[0][0] as number;
    const deleteFrequency =
      oscillators[1].frequency.setValueAtTime.mock.calls[0][0] as number;
    expect(typeFrequency).toBeGreaterThan(deleteFrequency);
    expect(oscillators[0].start).toHaveBeenCalledOnce();
    expect(oscillators[1].stop).toHaveBeenCalledOnce();
  });

  it("does nothing when sound is disabled", async () => {
    const createOscillator = vi.fn();
    class UnusedAudioContext {
      createOscillator = createOscillator;
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: UnusedAudioContext,
    });

    const { playKeySound } = await import("./audio");
    playKeySound("type", false);

    expect(createOscillator).not.toHaveBeenCalled();
  });
});
