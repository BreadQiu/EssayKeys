# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户是准备 IELTS 写作的中国学习者，以及作者邀请试用 EssayKeys 的朋友。典型使用场景是桌面浏览器，或使用外接键盘的 iPad Safari，需要在一段不中断的时间内专注完成整篇英文文章。

## Product Purpose

EssayKeys 提供无需登录、无需后端的整篇文章打字练习。用户从文章列表选择范文，从第一次有效输入开始计时，完成全文后查看总用时。成功标准是让用户快速进入打字状态、清楚看到当前进度，并在完成后得到简洁明确的结果。

## Positioning

EssayKeys 把 IELTS 范文作为完整输入目标，强调逐字符、大小写、标点和段落换行的严格匹配，而不是课程、排行榜或社交化练习。

## Operating Context

- 文章包含三篇原创 IELTS Task 2 高分风格范文和一篇用于实验的短文。
- 标点后的空格被移除；段落之间必须实际输入 Enter。
- 输入过程中会播放可选择的按键音和错误提示音。
- 音效偏好保存在当前浏览器中。
- 完成后只展示文章标题和总用时，不展示 WPM、正确率或历史记录。

## Capabilities and Constraints

- 使用 React、Vite 和 TypeScript 构建，并作为 GitHub Pages 静态站点发布。
- 无账户、数据库、云端同步、排行榜或成绩历史。
- 路由、计时、字符匹配和音效数据接口应保持稳定。
- 移动端不能横向溢出，触控目标应便于 iPad 使用。

## Brand Commitments

- 产品名称为 EssayKeys。
- 中文界面以清楚、直接、克制的语言为主。
- 当前字符的黄色高亮是打字反馈的核心品牌信号。
- 感谢 EdClub 在打字练习界面和音效上的设计启发。

## Evidence on Hand

三篇原创范文和一篇实验短文位于 `src/data/essays.ts`；十二套音效定义位于 `src/lib/soundPacks.ts`。项目不包含真实用户评价、成绩数据或外部品牌素材。

## Product Principles

- 先开始打字，再解释产品。
- 当前字符和下一项操作必须始终清楚可见。
- 装饰不能与文章内容和输入状态竞争。
- 保持严格练习规则，同时让错误和进度容易被理解。

## Accessibility & Inclusion

所有主要操作必须支持键盘，保持可见焦点、合理对比度和至少 44px 的移动端触控目标。界面应兼容窄屏以及使用外接键盘的 iPad。
