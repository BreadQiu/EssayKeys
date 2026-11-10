import { describe, expect, it } from "vitest";
import { SOUND_PACKS } from "./soundPacks";

describe("sound packs", () => {
  it("provides 10 paired packs with ordinary sounds in the majority", () => {
    expect(SOUND_PACKS).toHaveLength(10);
    expect(
      SOUND_PACKS.filter((pack) => pack.category === "ordinary"),
    ).toHaveLength(6);
    expect(SOUND_PACKS.filter((pack) => pack.category === "cute")).toHaveLength(
      2,
    );
    expect(SOUND_PACKS.filter((pack) => pack.category === "prank")).toHaveLength(
      2,
    );
    expect(new Set(SOUND_PACKS.map((pack) => pack.id)).size).toBe(10);
  });

  it("defines a dedicated typing sample and error sample for every pack", () => {
    for (const pack of SOUND_PACKS) {
      for (const kind of ["type", "error"] as const) {
        expect(pack.sampleAudio[kind]).toMatch(
          /^audio\/(?:essaykeys|edclub)\/.+\.mp3$/,
        );
      }
    }
  });
});
