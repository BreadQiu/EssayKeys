import { describe, expect, it } from "vitest";
import { SOUND_PACKS } from "./soundPacks";

describe("sound packs", () => {
  it("provides 11 paired packs with ordinary sounds in the majority", () => {
    expect(SOUND_PACKS).toHaveLength(11);
    expect(
      SOUND_PACKS.filter((pack) => pack.category === "ordinary"),
    ).toHaveLength(7);
    expect(SOUND_PACKS.filter((pack) => pack.category === "cute")).toHaveLength(
      2,
    );
    expect(SOUND_PACKS.filter((pack) => pack.category === "prank")).toHaveLength(
      2,
    );
    expect(new Set(SOUND_PACKS.map((pack) => pack.id)).size).toBe(11);
  });

  it("defines usable typing and error recipes for every pack", () => {
    for (const pack of SOUND_PACKS) {
      for (const kind of ["type", "error"] as const) {
        const recipe = pack.sounds[kind];
        expect(recipe.tones.length + recipe.noises.length).toBeGreaterThan(0);
      }
    }
  });
});
