import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { playKeySound, unlockKeySounds } from "../lib/audio";
import {
  SOUND_CATEGORY_LABELS,
  SOUND_PACKS,
  getSoundPack,
  type SoundCategory,
} from "../lib/soundPacks";
import {
  initialSession,
  isInsertionCorrect,
  updateSession,
} from "../lib/typing";

const TRIAL_TEXT = "Welcome to EssayKeys!";
const RESET_DELAY_MS = 700;
const CATEGORY_ORDER: SoundCategory[] = ["ordinary", "cute", "prank"];

type SoundPickerPageProps = {
  selectedPackId: string;
  onSelectPack: (packId: string) => void;
  onGoHome: () => void;
};

function SoundTrial({
  selectedPackId,
  inputRef,
}: {
  selectedPackId: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const [session, dispatch] = useReducer(
    (
      state: typeof initialSession,
      action: Parameters<typeof updateSession>[1],
    ) => updateSession(state, action, TRIAL_TEXT),
    initialSession,
  );
  const [inputFocused, setInputFocused] = useState(false);
  const [completedLoops, setCompletedLoops] = useState(0);
  const actualText = session.typed.map((character) => character.actual).join("");
  const progress = session.typed.length / TRIAL_TEXT.length;
  const isComplete = session.finishedAt !== null;

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCompletedLoops((count) => count + 1);
      dispatch({ type: "reset" });
      inputRef.current?.focus();
    }, RESET_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [isComplete]);

  function focusInput() {
    unlockKeySounds(selectedPackId);
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
          isInsertionCorrect(inserted, TRIAL_TEXT, session.typed.length)
            ? "type"
            : "error",
          true,
          selectedPackId,
        );
      }
    } else if (actualText.startsWith(nextValue)) {
      const removedCount = actualText.length - nextValue.length;
      if (removedCount > 0) {
        dispatch({ type: "backspace", count: removedCount });
        playKeySound("type", true, selectedPackId);
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

  return (
    <section className="sound-trial" aria-labelledby="sound-trial-heading">
      <p className="section-kicker">TRY IT</p>
      <h2 id="sound-trial-heading">打字试用</h2>
      <p>
        直接输入下面这句话，打错时会使用当前音效包里的错误提示音。
      </p>

      {!inputFocused ? (
        <button className="focus-prompt" type="button" onClick={focusInput}>
          <span aria-hidden="true">⌨</span>
          点击这里开始试打
        </button>
      ) : null}

      <button
        className="trial-text"
        type="button"
        onClick={focusInput}
        aria-label="音效试打区域，点击可重新聚焦输入"
      >
        <span aria-hidden="true">
          {Array.from(TRIAL_TEXT).map((character, index) => {
            const typed = session.typed[index];
            const characterState = typed
              ? typed.correct
                ? "correct"
                : "incorrect"
              : "pending";
            const current =
              index === session.typed.length && !isComplete ? " current" : "";

            return (
              <span
                className={`character ${characterState}${current}`}
                key={index}
              >
                {character}
              </span>
            );
          })}
        </span>
      </button>

      <div
        className="trial-progress"
        role="progressbar"
        aria-label="试打进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="trial-status" aria-live="polite">
        <span>已完成 {completedLoops} 次</span>
        <strong>
          {isComplete ? "完成一次，正在重新开始…" : "输入中"}
        </strong>
      </div>

      <textarea
        ref={inputRef}
        className="typing-input"
        value={actualText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        aria-label="音效试打输入区"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
    </section>
  );
}

export function SoundPickerPage({
  selectedPackId,
  onSelectPack,
  onGoHome,
}: SoundPickerPageProps) {
  const selectedPack = getSoundPack(selectedPackId);
  const trialInputRef = useRef<HTMLTextAreaElement>(null);

  function selectPack(packId: string) {
    onSelectPack(packId);
    unlockKeySounds(packId);
    playKeySound("type", true, packId);
    trialInputRef.current?.focus();
  }

  return (
    <div className="sound-picker-page">
      <header className="sound-picker-header">
        <button className="back-button" type="button" onClick={onGoHome}>
          <span aria-hidden="true">←</span>
          返回首页
        </button>
        <p>ESSAYKEYS SOUND LAB</p>
        <span>{selectedPack.name}</span>
      </header>

      <main className="sound-picker-main">
        <div className="sound-picker-intro">
          <p className="section-kicker">SOUND SETTINGS</p>
          <h1>选择你的按键音</h1>
          <p>
            每一套同时包含敲键盘声和打错字声。点击卡片立即保存，下次打开仍会使用。
          </p>
        </div>

        <div className="sound-picker-layout">
          <div className="sound-library">
            {CATEGORY_ORDER.map((category) => {
              const packs = SOUND_PACKS.filter(
                (pack) => pack.category === category,
              );

              return (
                <section className="sound-category" key={category}>
                  <div className="sound-category-heading">
                    <h2>{SOUND_CATEGORY_LABELS[category]}</h2>
                    <span>{packs.length} 套</span>
                  </div>
                  <div className="sound-pack-grid">
                    {packs.map((pack) => {
                      const isSelected = pack.id === selectedPack.id;

                      return (
                        <button
                          className={`sound-pack-card${isSelected ? " selected" : ""}`}
                          type="button"
                          key={pack.id}
                          aria-pressed={isSelected}
                          onClick={() => selectPack(pack.id)}
                        >
                          <span className="sound-pack-topline">
                            <span>{SOUND_CATEGORY_LABELS[pack.category]}</span>
                            <span>{isSelected ? "✓ 已选择" : "选择"}</span>
                          </span>
                          <strong>{pack.name}</strong>
                          <span className="sound-pack-description">
                            {pack.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="sound-trial-column">
            <SoundTrial
              selectedPackId={selectedPack.id}
              inputRef={trialInputRef}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
