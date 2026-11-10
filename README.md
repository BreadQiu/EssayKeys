# EssayKeys

一个无需后端、无需登录的雅思文章逐字打字练习。第一次按键开始计时，完成整篇后显示总用时。内置 10 套采样音效，每套分别绑定敲字与错误声，并保留 EdClub 原声；音效可以在练习页关闭。

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

文章集中在 `src/data/essays.ts`。每篇文章由 `id`、`title` 和 `paragraphs` 组成。文章保留标点后的正常空格，段落之间需要按 Enter 完成换行。

EssayKeys 不包含账户、历史记录或云端数据。

## 致谢

感谢 [EdClub](https://www.edclub.com/) 的打字练习界面与音效提供的设计启发。公开发布其中的原声素材前，请确认相应授权。
