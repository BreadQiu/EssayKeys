import { describe, expect, it } from "vitest";
import {
  countWords,
  essays,
  getEssayTarget,
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

  it("preserves spaces after punctuation", () => {
    expect(getEssayTarget(essays[0])).toContain("issue. While");
    for (const essay of essays) {
      for (const paragraph of essay.paragraphs) {
        expect(paragraph).not.toMatch(/[.!?,:;]\S/);
      }
    }
  });

  it("connects adjacent paragraphs with a required line break", () => {
    expect(getEssayTarget(essays[0])).toContain("sustainable.\nThe");
  });
});
