import {
  DEFAULT_SOUND_PACK_ID,
  getSoundPack,
  type KeySoundPack,
} from "./soundPacks";

export const SOUND_PREFERENCES_KEY = "essaykeys.sound-preferences.v2";

export type SoundPreferences = {
  packId: string;
  enabled: boolean;
};

export const DEFAULT_SOUND_PREFERENCES: SoundPreferences = {
  packId: DEFAULT_SOUND_PACK_ID,
  enabled: true,
};

export function loadSoundPreferences(
  packResolver: (id: string) => KeySoundPack = getSoundPack,
): SoundPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_SOUND_PREFERENCES;
  }

  try {
    const stored = window.localStorage.getItem(SOUND_PREFERENCES_KEY);
    if (!stored) {
      return DEFAULT_SOUND_PREFERENCES;
    }

    const parsed = JSON.parse(stored) as Partial<SoundPreferences>;
    if (
      typeof parsed.packId !== "string" ||
      typeof parsed.enabled !== "boolean" ||
      packResolver(parsed.packId).id !== parsed.packId
    ) {
      return DEFAULT_SOUND_PREFERENCES;
    }

    return { packId: parsed.packId, enabled: parsed.enabled };
  } catch {
    return DEFAULT_SOUND_PREFERENCES;
  }
}

export function saveSoundPreferences(preferences: SoundPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      SOUND_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Storage can be unavailable in private mode; sound still works for this visit.
  }
}
