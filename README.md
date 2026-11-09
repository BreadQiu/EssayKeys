# EssayKeys V2

一个无需后端、无需登录的雅思文章逐字打字练习。第一次按键开始计时，完成整篇后显示总用时。V2 提供 11 套本地合成音效包，可以分别试听敲击声和错误提示音；选择与音效开关会保存在当前浏览器。

V1 公开练习地址：<https://breadqiu.github.io/EssayKeys/>

V2 当前仅在本地开发，尚未发布到该地址。

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

EssayKeys V2 不包含账户、历史记录或云端数据。音效偏好仅保存在当前设备和浏览器。
