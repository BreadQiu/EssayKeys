# EssayKeys V2

无需登录、无需后端的雅思文章逐字打字练习。第一次按键开始计时，完成后显示总用时。

公开练习地址：<https://breadqiu.github.io/EssayKeys/>

## V2 更新

- 新增 12 套成套音效，覆盖普通、可爱和恶搞风格，并按普通类优先。
- 新增音效选择页，选择后自动聚焦试打区；选择与开关状态保存在当前浏览器。
- 实验短文移至文章列表末尾并明确标识。
- 改进 iPad 触屏、外接键盘和 Web Audio 启动体验。
- 移除文章标点后的空格，段落直接衔接。

## 致谢

感谢 [EdClub](https://www.edclub.com/) 的打字练习界面及第 89 关音效提供的设计启发。“EdClub 原声”使用其公开音效文件，公开发布前请确认相应授权。

## 本地运行

```bash
npm install
npm run dev
```

构建、预览与测试：

```bash
npm run build
npm run preview
npm test
```

## 修改文章

文章集中在 `src/data/essays.ts`。V2 不包含账户、云端历史或跨设备同步。
