import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SOUND_PREFERENCES,
  SOUND_PREFERENCES_KEY,
  loadSoundPreferences,
  saveSoundPreferences,
} from "./soundPreferences";

beforeEach(() => {
  window.localStorage.clear();
});

describe("sound preferences", () => {
  it("loads defaults when no selection has been saved", () => {
    expect(loadSoundPreferences()).toEqual(DEFAULT_SOUND_PREFERENCES);
  });

  it("saves and restores the selected pack and enabled state", () => {
    saveSoundPreferences({ packId: "bubble-pop", enabled: false });
    expect(loadSoundPreferences()).toEqual({
      packId: "bubble-pop",
      enabled: false,
    });
  });

  it("falls back safely for malformed or unknown data", () => {
    window.localStorage.setItem(SOUND_PREFERENCES_KEY, "{bad json");
    expect(loadSoundPreferences()).toEqual(DEFAULT_SOUND_PREFERENCES);

    window.localStorage.setItem(
      SOUND_PREFERENCES_KEY,
      JSON.stringify({ packId: "not-a-pack", enabled: true }),
    );
    expect(loadSoundPreferences()).toEqual(DEFAULT_SOUND_PREFERENCES);
  });
});
