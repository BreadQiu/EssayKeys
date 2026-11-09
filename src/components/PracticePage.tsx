import {
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { getEssayTarget, type EssayDefinition } from "../data/essays";
import {
  formatDuration,
  getElapsedTime,
  initialSession,
  isInsertionCorrect,
  updateSession,
  type TypedCharacter,
} from "../lib/typing";
import { playKeySound } from "../lib/audio";

type PracticePageProps = {
  essay: EssayDefinition;
  onGoHome: () => void;
  onDirtyChange: (dirty: boolean) => void;
  requestGoHome: () => void;
};

function Character({
  character,
  typed,
  index,
  isCurrent,
}: {
  character: string;
  typed: TypedCharacter | undefined;
  index: number;
  isCurrent: boolean;
}) {
  const state = typed
    ? typed.correct
      ? "correct"
      : "incorrect"
    : "pending";

  return (
    <span
      className={`character ${state}${isCurrent ? " current" : ""}`}
      data-character-index={index}
      aria-hidden="true"
    >
      {character}
    </span>
  );
}

function EssayBody({
  essay,
  typed,
}: {
  essay: EssayDefinition;
  typed: TypedCharacter[];
}) {
  let characterIndex = 0;

  return (
    <div className="essay-body" aria-hidden="true">
      {essay.paragraphs.map((paragraph, paragraphIndex) => {
        const characters = Array.from(paragraph);
        const startIndex = characterIndex;
        characterIndex = startIndex + characters.length;

        return (
          <p key={paragraphIndex}>
            {characters.map((character, index) => (
              <Character
                key={startIndex + index}
                character={character}
                typed={typed[startIndex + index]}
                index={startIndex + index}
                isCurrent={startIndex + index === typed.length}
              />
            ))}
          </p>
        );
      })}
    </div>
  );
}

function ResultCard({
  essay,
  duration,
  onGoHome,
}: {
  essay: EssayDefinition;
  duration: number;
  onGoHome: () => void;
}) {
  return (
    <main className="result-page">
      <section className="result-card" aria-labelledby="result-heading">
        <p className="result-kicker">SESSION COMPLETE</p>
        <div className="result-check" aria-hidden="true">
          ✓
        </div>
        <h1 id="result-heading">练习完成</h1>
        <p className="result-essay-title">{essay.title}</p>

        <div className="time-block">
          <span>总用时</span>
          <strong aria-live="polite">{formatDuration(duration)}</strong>
        </div>

        <button className="primary-button" type="button" onClick={onGoHome}>
          确认并返回
        </button>
      </section>
    </main>
  );
}

export function PracticePage({
  essay,
  onGoHome,
  onDirtyChange,
  requestGoHome,
}: PracticePageProps) {
  const target = getEssayTarget(essay);
  const [session, dispatch] = useReducer(
    (state: typeof initialSession, action: Parameters<typeof updateSession>[1]) =>
      updateSession(state, action, target),
    initialSession,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const actualText = session.typed.map((character) => character.actual).join("");
  const isFinished = session.finishedAt !== null;
  const isDirty = session.typed.length > 0 && !isFinished;
  const progress = target.length === 0 ? 0 : session.typed.length / target.length;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    return () => onDirtyChange(false);
  }, [onDirtyChange]);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (isFinished) {
      inputRef.current?.blur();
    }
  }, [isFinished]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (document.activeElement === input && input) {
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }
  }, [actualText]);

  useEffect(() => {
    const scrollCurrentCharacterIntoView = () => {
      if (!inputFocused || isFinished) {
        return;
      }

      const current = document.querySelector<HTMLElement>(
        `[data-character-index="${session.typed.length}"]`,
      );
      if (!current) {
        return;
      }

      const rect = current.getBoundingClientRect();
      const visibleBottom = window.visualViewport?.height ?? window.innerHeight;
      if (rect.top < 130 || rect.bottom > visibleBottom - 70) {
        current.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      }
    };

    const frame = window.requestAnimationFrame(scrollCurrentCharacterIntoView);
    window.visualViewport?.addEventListener("resize", scrollCurrentCharacterIntoView);
    window.addEventListener("resize", scrollCurrentCharacterIntoView);

    return () => {
      window.cancelAnimationFrame(frame);
      window.visualViewport?.removeEventListener(
        "resize",
        scrollCurrentCharacterIntoView,
      );
      window.removeEventListener("resize", scrollCurrentCharacterIntoView);
    };
  }, [inputFocused, isFinished, session.typed.length]);

  function focusInput(event?: MouseEvent<HTMLElement>) {
    event?.preventDefault();
    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const input = event.currentTarget;
    const nextValue = input.value;

    if (nextValue.length > actualText.length && nextValue.startsWith(actualText)) {
      const inserted = nextValue
        .slice(actualText.length)
        .replace(/[\r\n]/g, "");

      if (inserted.length > 0) {
        dispatch({ type: "input", text: inserted, at: Date.now() });
        playKeySound(
          isInsertionCorrect(inserted, target, session.typed.length)
            ? "type"
            : "error",
          soundEnabled,
        );
      }
    } else if (actualText.startsWith(nextValue)) {
      const removedCount = actualText.length - nextValue.length;
      if (removedCount > 0) {
        dispatch({ type: "backspace", count: removedCount });
        playKeySound("type", soundEnabled);
      }
    }

    input.value = actualText;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    event.preventDefault();
  }

  function toggleSound() {
    setSoundEnabled((enabled) => !enabled);
    inputRef.current?.focus();
  }

  if (isFinished) {
    return (
      <ResultCard
        essay={essay}
        duration={getElapsedTime(session)}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <div className="practice-page">
      <header className="practice-header">
        <button className="back-button" type="button" onClick={requestGoHome}>
          <span aria-hidden="true">←</span>
          返回文章
        </button>
        <p className="practice-mode">整篇计时练习</p>
        <div className="practice-tools">
          <p className="typing-status" aria-live="polite">
            {session.startedAt === null ? "等待输入" : "计时中"}
          </p>
          <button
            className="sound-toggle"
            type="button"
            aria-pressed={soundEnabled}
            onClick={toggleSound}
          >
            <span aria-hidden="true">♪</span>
            音效 {soundEnabled ? "开" : "关"}
          </button>
        </div>
      </header>

      <main className="practice-main">
        <section className="lesson-intro" aria-labelledby="essay-heading">
          <div>
            <p className="lesson-kicker">IELTS TASK 2 · 高分范文</p>
            <h1 id="essay-heading">{essay.title}</h1>
          </div>
          <p className="progress-number">{Math.round(progress * 100)}%</p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="练习进度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span style={{ width: `${progress * 100}%` }} />
          </div>
        </section>

        {!inputFocused ? (
          <button
            className="focus-prompt"
            type="button"
            onClick={focusInput}
          >
            <span aria-hidden="true">⌨</span>
            点击这里开始输入
          </button>
        ) : null}

        <section
          className="typing-surface"
          onClick={focusInput}
          aria-label="打字练习区域，点击可重新聚焦输入"
        >
          <EssayBody essay={essay} typed={session.typed} />
        </section>

        <div className="practice-footnote">
          <span>第一次按键后开始计时</span>
          <span>退格可撤销 · 切换页面不会暂停</span>
        </div>
      </main>

      <textarea
        ref={inputRef}
        className="typing-input"
        value={actualText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        aria-label="作文输入区"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
