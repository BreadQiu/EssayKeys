import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SoundPickerPage } from "./SoundPickerPage";

const audioMocks = vi.hoisted(() => ({
  playKeySound: vi.fn(),
  unlockKeySounds: vi.fn(),
}));

vi.mock("../lib/audio", () => audioMocks);

describe("sound trial input sounds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preloads the active sound pair before trial typing starts", () => {
    render(
      <SoundPickerPage
        selectedPackId="butter-thock"
        onSelectPack={vi.fn()}
        onGoHome={vi.fn()}
      />,
    );

    expect(audioMocks.unlockKeySounds).toHaveBeenCalledWith("butter-thock");
  });

  it("plays one sound for every character in a coalesced trial event", () => {
    render(
      <SoundPickerPage
        selectedPackId="butter-thock"
        onSelectPack={vi.fn()}
        onGoHome={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("音效试打输入区"), {
      target: { value: "Wel" },
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
