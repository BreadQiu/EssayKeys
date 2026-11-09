export type TypedCharacter = {
  expected: string;
  actual: string;
  correct: boolean;
};

export type SessionState = {
  typed: TypedCharacter[];
  startedAt: number | null;
  finishedAt: number | null;
};

export type SessionAction =
  | { type: "input"; text: string; at: number }
  | { type: "backspace"; count?: number }
  | { type: "reset" };

export const initialSession: SessionState = {
  typed: [],
  startedAt: null,
  finishedAt: null,
};

export function updateSession(
  state: SessionState,
  action: SessionAction,
  target: string,
): SessionState {
  if (state.finishedAt !== null && action.type !== "reset") {
    return state;
  }

  if (action.type === "reset") {
    return initialSession;
  }

  if (action.type === "backspace") {
    const count = Math.max(0, action.count ?? 1);
    if (count === 0 || state.typed.length === 0) {
      return state;
    }

    const typed = state.typed.slice(0, Math.max(0, state.typed.length - count));
    return {
      typed,
      startedAt: typed.length === 0 ? null : state.startedAt,
      finishedAt: null,
    };
  }

  const typed = state.typed.slice();

  for (const character of Array.from(action.text)) {
    if (character === "\n" || character === "\r") {
      continue;
    }

    if (typed.length >= target.length) {
      break;
    }

    const expected = target[typed.length];
    typed.push({
      expected,
      actual: character,
      correct: character === expected,
    });
  }

  if (typed.length === state.typed.length) {
    return state;
  }

  return {
    typed,
    startedAt: state.startedAt ?? action.at,
    finishedAt: typed.length === target.length ? action.at : null,
  };
}

export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getElapsedTime(state: SessionState): number {
  if (state.startedAt === null || state.finishedAt === null) {
    return 0;
  }

  return Math.max(0, state.finishedAt - state.startedAt);
}

export function isInsertionCorrect(
  text: string,
  target: string,
  startIndex: number,
): boolean {
  return Array.from(text).every(
    (character, index) => character === target[startIndex + index],
  );
}
