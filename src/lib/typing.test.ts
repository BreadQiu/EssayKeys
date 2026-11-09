import { describe, expect, it } from "vitest";
import {
  formatDuration,
  getElapsedTime,
  initialSession,
  updateSession,
} from "./typing";

describe("typing session", () => {
  it("strictly matches characters, including spaces and punctuation", () => {
    const target = "Hello, world.";
    const first = updateSession(
      initialSession,
      { type: "input", text: "hello", at: 100 },
      target,
    );

    expect(first.typed.map((character) => character.correct)).toEqual([
      false,
      true,
      true,
      true,
      true,
    ]);
    expect(first.startedAt).toBe(100);

    const completed = updateSession(
      first,
      { type: "input", text: ", world.", at: 2_100 },
      target,
    );

    expect(completed.typed).toHaveLength(target.length);
    expect(completed.finishedAt).toBe(2_100);
    expect(getElapsedTime(completed)).toBe(2_000);
  });

  it("advances after an incorrect character", () => {
    const result = updateSession(
      initialSession,
      { type: "input", text: "x", at: 10 },
      "a",
    );

    expect(result.typed).toEqual([
      { expected: "a", actual: "x", correct: false },
    ]);
    expect(result.finishedAt).toBe(10);
  });

  it("joins paragraphs with a single typed space", () => {
    const target = "First. Second.";
    const result = updateSession(
      initialSession,
      { type: "input", text: "First. Second.", at: 10 },
      target,
    );

    expect(result.typed[6]).toEqual({
      expected: " ",
      actual: " ",
      correct: true,
    });
    expect(result.finishedAt).toBe(10);
  });

  it("ignores line breaks inserted by the keyboard", () => {
    const result = updateSession(
      initialSession,
      { type: "input", text: "a\nb", at: 10 },
      "ab",
    );

    expect(result.typed.map((character) => character.actual).join("")).toBe("ab");
  });

  it("backs up multiple characters and resets timing when empty", () => {
    const typed = updateSession(
      initialSession,
      { type: "input", text: "abc", at: 10 },
      "abcde",
    );
    const partial = updateSession(typed, { type: "backspace", count: 1 }, "abcde");

    expect(partial.typed).toHaveLength(2);
    expect(partial.startedAt).toBe(10);

    const empty = updateSession(partial, { type: "backspace", count: 5 }, "abcde");
    expect(empty.typed).toHaveLength(0);
    expect(empty.startedAt).toBeNull();
  });

  it("formats elapsed time as minutes and seconds", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDuration(59_500)).toBe("01:00");
    expect(formatDuration(125_000)).toBe("02:05");
  });
});
