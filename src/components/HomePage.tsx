import { countWords, essays } from "../data/essays";

type HomePageProps = {
  onSelectEssay: (id: string) => void;
  onOpenSoundSettings: () => void;
  activeSoundPackName: string;
};

export function HomePage({
  onSelectEssay,
  onOpenSoundSettings,
  activeSoundPackName,
}: HomePageProps) {
  return (
    <div className="home-page">
      <header className="app-header home-header">
        <div className="app-header-inner">
          <h1 className="wordmark">EssayKeys</h1>
          <div className="app-header-actions">
            <button
              className="sound-menu-button"
              type="button"
              onClick={onOpenSoundSettings}
              aria-label={`音效，当前使用：${activeSoundPackName}`}
            >
              <span aria-hidden="true">♪</span>
              <span>音效</span>
              <span className="sound-menu-current">{activeSoundPackName}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="home-main skip-target" id="main-content" tabIndex={-1}>
        <section className="home-intro" aria-labelledby="home-heading">
          <h2 id="home-heading">选择一篇文章</h2>
          <p className="home-description">从第一个字符开始计时。</p>
        </section>

        <div className="essay-list">
          {essays.map((essay) => (
            <article
              className={`essay-row${essay.isExperiment ? " experiment" : ""}`}
              key={essay.id}
            >
              <div className="essay-card-copy">
                {essay.isExperiment ? (
                  <p className="essay-label">实验短文</p>
                ) : null}
                <h3>{essay.title}</h3>
              </div>
              <p className="essay-meta">约 {countWords(essay)} 词</p>
              <button
                className="start-button"
                type="button"
                onClick={() => onSelectEssay(essay.id)}
                aria-label={`开始练习：${essay.title}`}
              >
                开始
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
