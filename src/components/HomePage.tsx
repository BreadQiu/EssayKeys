import { countWords, essays } from "../data/essays";

type HomePageProps = {
  onSelectEssay: (id: string) => void;
};

export function HomePage({ onSelectEssay }: HomePageProps) {
  return (
    <div className="home-page">
      <div className="brand-bar">
        <p className="wordmark" aria-label="EssayKeys">
          Essay<em>Keys</em>
        </p>
        <p className="brand-note">雅思文章计时打字 · V1</p>
      </div>

      <header className="hero">
        <p className="eyebrow">IELTS TYPING PRACTICE</p>
        <h1>雅思计时打字</h1>
        <p className="hero-copy">
          选择一篇作文，从第一个字符开始计时。
          <br />
          专注于打完整篇文字。
        </p>
        <span className="hero-mark" aria-hidden="true">
          Aa
        </span>
      </header>

      <main>
        <div className="section-heading">
          <div>
            <p className="section-kicker">PRACTICE ARTICLES</p>
            <h2>选择文章</h2>
          </div>
          <span>{essays.length} 篇</span>
        </div>

        <div className="essay-list">
          {essays.map((essay, index) => (
            <article className="essay-card" key={essay.id}>
              <div className="essay-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="essay-card-copy">
                <p className="essay-label">IELTS TASK 2 · 高分范文</p>
                <h3>{essay.title}</h3>
                <p className="essay-meta">约 {countWords(essay)} 词 · 整篇计时</p>
              </div>
              <button
                className="start-button"
                type="button"
                onClick={() => onSelectEssay(essay.id)}
              >
                开始练习
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        <p>第一次按键后开始计时 · 完成后查看总用时</p>
        <span>EssayKeys · V1</span>
      </footer>
    </div>
  );
}
