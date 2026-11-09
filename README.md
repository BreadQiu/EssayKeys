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

文章集中在 `src/data/essays.ts`。每篇文章由 `id`、`title` 和 `paragraphs` 组成。标点后的空格会被移除，段落直接衔接，打字时不需要输入回车。

EssayKeys V1 不包含账户、历史记录或云端数据。

## V2 更新

- 新增音效选择页，提供 12 套普通、可爱和恶搞风格音效，并包含第 89 关原声。
- 选择音效后自动聚焦试打区，打字、错误和删字均有声音反馈。
- 音效选择与开关状态保存在当前浏览器。
- 实验短文移至列表末尾并明确标识，继续完善 iPad 外接键盘体验。

## 致谢

感谢 [EdClub](https://www.edclub.com/) 的打字练习界面和第 89 关音效提供的设计启发。公开发布其中的原声素材前，请确认相应授权。
