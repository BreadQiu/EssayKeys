# EssayKeys

一个无需后端、无需登录的雅思文章逐字打字练习。第一次按键开始计时，完成整篇后显示总用时。打字与删字会播放由 Web Audio 实时合成的轻量按键音，也可以在练习页关闭。

公开练习地址：<https://breadqiu.github.io/EssayKeys/>

## 本地运行

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

运行测试：

```bash
npm test
```

## 修改文章

文章集中在 `src/data/essays.ts`。每篇文章由 `id`、`title` 和 `paragraphs` 组成。标点后的空格会被移除，段落之间需要按 Enter 完成换行。

EssayKeys 不包含账户、历史记录或云端数据。

## 致谢

感谢 [EdClub](https://www.edclub.com/) 的打字练习界面和第 89 关音效提供的设计启发。公开发布其中的原声素材前，请确认相应授权。
