import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { essays } from "../data/essays";
import { PracticePage } from "./PracticePage";

const audioMocks = vi.hoisted(() => ({
  playKeySound: vi.fn(),
  unlockKeySounds: vi.fn(),
}));

vi.mock("../lib/audio", () => audioMocks);

describe("practice input sounds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preloads the selected sound pair before the first keystroke", () => {
    render(
      <PracticePage
        essay={essays[0]}
        onGoHome={vi.fn()}
        onDirtyChange={vi.fn()}
        requestGoHome={vi.fn()}
        soundPackId="butter-thock"
        soundEnabled
        onSoundEnabledChange={vi.fn()}
      />,
    );

    expect(audioMocks.unlockKeySounds).toHaveBeenCalledWith("butter-thock");
  });

  it("plays one sound for every character in a coalesced input event", () => {
    render(
      <PracticePage
        essay={essays[0]}
        onGoHome={vi.fn()}
        onDirtyChange={vi.fn()}
        requestGoHome={vi.fn()}
        soundPackId="butter-thock"
        soundEnabled
        onSoundEnabledChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("作文输入区"), {
      target: { value: "Whe" },
    });

    expect(audioMocks.playKeySound).toHaveBeenCalledTimes(3);
    expect(audioMocks.playKeySound).toHaveBeenNthCalledWith(
      1,
      "type",
      true,
      "butter-thock",
    );
    expect(audioMocks.playKeySound).toHaveBeenNthCalledWith(
      2,
      "type",
      true,
      "butter-thock",
    );
    expect(audioMocks.playKeySound).toHaveBeenNthCalledWith(
      3,
      "type",
      true,
      "butter-thock",
    );
  });
});
