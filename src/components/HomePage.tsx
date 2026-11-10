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
          <p className="wordmark" aria-label="EssayKeys">
            Essay<em>Keys</em>
          </p>
          <div className="app-header-actions">
            <span className="version-label">v0.4.0</span>
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
          <h1 id="home-heading">EssayKeys</h1>
          <p className="home-subtitle">雅思文章打字练习</p>
          <p className="home-description">选一篇范文，从第一个字符开始计时。</p>
        </section>

        <div className="section-heading">
          <h2>文章</h2>
          <span>{essays.length} 篇</span>
        </div>

        <div className="essay-list">
          {essays.map((essay) => (
            <article
              className={`essay-row${essay.isExperiment ? " experiment" : ""}`}
              key={essay.id}
            >
              <div className="essay-card-copy">
                <p className="essay-label">
                  {essay.isExperiment ? "实验" : "雅思 Task 2"}
                </p>
                <h3>{essay.title}</h3>
              </div>
              <p className="essay-meta">约 {countWords(essay)} 词</p>
              <button
                className="start-button"
                type="button"
                onClick={() => onSelectEssay(essay.id)}
                aria-label={`开始练习：${essay.title}`}
              >
                练习
              </button>
            </article>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        <p>第一次按键后开始计时</p>
        <span>完成后查看总用时</span>
      </footer>
    </div>
  );
}
