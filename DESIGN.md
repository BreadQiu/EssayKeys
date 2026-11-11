---
name: EssayKeys
description: A pure-white, text-first typing practice interface for complete IELTS essays.
colors:
  canvas: "#ffffff"
  surface: "#ffffff"
  ink: "#171717"
  muted: "#737373"
  line: "#e5e5e5"
  line-strong: "#cfcfcf"
  primary: "#171717"
  highlight: "#f1d45b"
  error: "#b42318"
typography:
  ui:
    fontFamily: "Aptos, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
  essay:
    fontFamily: "Charter, Georgia, Cambria, Times New Roman, serif"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "72px"
---

# Design System: EssayKeys

## Direction

EssayKeys is a single-purpose typing surface presented on an uninterrupted white page. A large serif `EssayKeys` masthead anchors the home page; the quieter index heading `选择一篇文章` introduces the task without competing with the product identity. Black and gray text establishes orientation, whitespace establishes hierarchy, and hairline rules separate only where structure would otherwise be unclear.

The visual rule is simple: **white page, black type, one yellow current character**.

## Color

- **Canvas and surface** (`#ffffff`): every page and control uses the same pure-white background.
- **Ink** (`#171717`): primary labels, headings, completed text and primary actions.
- **Muted** (`#737373`): metadata, pending essay text and secondary navigation.
- **Hairline** (`#e5e5e5` / `#cfcfcf`): separators and structural boundaries.
- **Highlight** (`#f1d45b`): reserved exclusively for the character currently being typed.
- **Error** (`#b42318`): incorrect text, indicated with color and an underline rather than a filled panel.

There are no tinted page sections, gradient backgrounds or decorative accent colors.

## Typography

UI text uses Aptos, Segoe UI and their Chinese fallbacks. Essay titles, essay bodies and the trial sentence use Charter, Georgia and related serif fallbacks.

- Home masthead: 42px desktop, 37px mobile, serif weight 500.
- Home index heading: 27px desktop, 25px mobile, weight 590.
- Page heading: 32–34px desktop, 27–29px mobile.
- Essay body: 21.5px desktop, 19.5px mobile, line-height 1.78–1.82.
- Metadata and actions: 10–13px.
- Result time: 68px desktop, 56px mobile, tabular numerals.

English reading columns stay near 72 characters. Explanatory copy stays short and secondary to the task.

## Layout

- Home content width: 760px.
- Practice content width: 780px.
- Sound chooser width: 1000px.
- Header height: 76px desktop, 64px mobile.
- Mobile gutter: 16px on each side.
- Article and sound entries use open rows with hairline separators.
- Practice typing occurs directly on the page rather than inside a bordered card.
- Sound trial becomes the first section below the header on tablet and mobile.

```text
EssayKeys                                      ♪ 音效

选择一篇文章
从第一个字符开始计时。
────────────────────────────────────────────
Essay title                                 开始
约 251 词
────────────────────────────────────────────
```

## Components

### Navigation

Navigation is plain text. The home page leads with the large `EssayKeys` masthead in the upper-left and a compact sound utility in the upper-right. Practice and sound pages use a sticky white header with one bottom hairline.

### Article Rows

Article rows show only the title, word count and a text action. The experiment article adds a small `实验短文` label. No card background, shadow or hover fill is used.

### Buttons

“开始” and sound actions read as compact text actions. The only filled button is the final `确认并返回` action, which uses black with a 2px radius. Focus rings are always black and visible.

### Typing Surface

The essay sits directly on white. Pending text is gray, correct text becomes near-black, incorrect text becomes red with an underline, and the current character receives the yellow highlight. Paragraph breaks use a quiet `↵` marker.

### Sound Picker

Sound packs are open, two-column rows on desktop and one-column rows on mobile. Selection is communicated by a filled black marker, heavier name and `已选` label. The trial area uses hairlines only, with no enclosing card, completion counter or restart notice.

## Motion

Transitions are limited to 140ms color feedback for controls and 70ms feedback for typed characters. Reduced-motion preferences disable smooth scrolling and transition durations.

## Accessibility

- Keyboard focus remains visible throughout.
- Touch actions are at least 44px tall.
- Mobile layouts must maintain `scrollWidth === innerWidth`.
- Yellow is never the only signal for an incorrect character; errors also use red and an underline.
- Text and background contrast remain clear on the pure-white canvas.

## Avoid

- Cool-paper or warm-paper page backgrounds.
- Cards, shadows, gradients, decorative circles or rounded feature panels.
- Repeated product titles, version labels and decorative section counters.
- Accent colors outside the current character and error states.
- Chrome that competes visually with the essay or typing task.
