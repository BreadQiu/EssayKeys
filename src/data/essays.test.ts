import { describe, expect, it } from "vitest";
import {
  countWords,
  essays,
  getEssayTarget,
  removeSpacesAfterPunctuation,
} from "./essays";

describe("essay data", () => {
  it("places the short experiment article last and marks it clearly", () => {
    const experiment = essays.at(-1);
    expect(experiment?.title).toBe("Welcome to EssayKeys!");
    expect(experiment?.isExperiment).toBe(true);
    expect(experiment && getEssayTarget(experiment)).toBe(
      "Welcome to EssayKeys!",
    );
    expect(experiment && countWords(experiment)).toBe(3);
  });

  it("removes whitespace after every punctuation mark", () => {
    expect(
      removeSpacesAfterPunctuation(
        "First sentence. Second sentence, then another! Is this ready? Yes: go; now.",
      ),
    ).toBe(
      "First sentence.Second sentence,then another!Is this ready?Yes:go;now.",
    );

    for (const essay of essays) {
      for (const paragraph of essay.paragraphs) {
        expect(paragraph).not.toMatch(/[.!?,:;]\s+\S/);
      }
    }
  });

  it("connects adjacent paragraphs without an extra space", () => {
    expect(getEssayTarget(essays[0])).toContain("issue.While");
  });
});
