---
name: EssayKeys
description: A quiet editorial proofing interface for typing complete IELTS essays.
colors:
  canvas: "#f3f5f2"
  surface: "#ffffff"
  ink: "#18221d"
  muted: "#69736d"
  line: "#cfd6d0"
  primary: "#285c49"
  primary-soft: "#e2ece6"
  highlight: "#f1d45b"
  error: "#b74640"
typography:
  display:
    fontFamily: "Aptos, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "52px"
    fontWeight: 680
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Charter, Georgia, Cambria, Times New Roman, serif"
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Charter, Georgia, Cambria, Times New Roman, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Aptos, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "#1f4c3b"
    textColor: "{colors.surface}"
  sound-menu:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
---

# Design System: EssayKeys

## Overview

**Creative North Star: "The Clean Proof"**

EssayKeys should feel like a well-prepared writing proof rather than a marketing page. The interface is cool, flat and precise; typography and generous spacing establish hierarchy while rules replace decorative cards. The essay itself is the main object, and the yellow current-character highlight is the single moment of visual emphasis.

**Key Characteristics:**

- Cool paper rather than warm cream.
- Thin rules instead of shadows.
- Compact Chinese UI paired with a readable English serif.
- One meaningful accent: the current typing position.
- The reading and typing task remains visible before any explanation.

## Colors

The palette is restrained and functional, with green reserved for navigation and primary actions.

### Primary

- **Proof Green** (`{colors.primary}`): primary buttons, progress, active sound selection and focus.
- **Soft Proof Green** (`{colors.primary-soft}`): selected backgrounds and restrained confirmation states.

### Neutral

- **Cool Paper** (`{colors.canvas}`): page background.
- **Clean Sheet** (`{colors.surface}`): the typing surface and controls.
- **Proof Ink** (`{colors.ink}`): primary interface text.
- **Pencil Gray** (`{colors.muted}`): metadata, pending essay text and secondary copy.
- **Editing Rule** (`{colors.line}`): separators and control outlines.

### State

- **Highlighter Yellow** (`{colors.highlight}`): current character only.
- **Correction Red** (`{colors.error}`): incorrect character feedback only.

**The One Highlight Rule.** Yellow belongs to the current character. It is never a general page accent.

## Typography

**Display Font:** Aptos with Segoe UI, PingFang SC and Microsoft YaHei fallbacks
**Body Font:** Charter with Georgia, Cambria and Times New Roman fallbacks

**Character:** The sans UI stays compact and direct. The serif appears only where the user reads an article title or essay text, reinforcing the editorial setting.

### Hierarchy

- **Display** (680, 52px desktop / 38px mobile, 1): product name on the home page.
- **Headline** (680, 40px desktop / 34px mobile, 1.1): page titles such as `按键音`.
- **Title** (500, 34px desktop / 28px mobile, 1.2): essay titles and compact article rows.
- **Body** (400, 22px desktop / 20px mobile, 1.75): the English essay, held to 65–75 characters per line.
- **Label** (500–650, 11–14px, 1.5): controls, metadata and section labels.

**The Two Voices Rule.** Use sans for controls and orientation; use serif for content the user reads or types.

## Layout

The home page uses a 1040px content width, the practice page 920px and the sound picker 1120px. Horizontal rules define sections and article rows. Page headers are 64px high with a 48px gutter, becoming 58px high with a 16px gutter on phones. Desktop practice text is limited to 72ch and the layout collapses structurally below 900px and 640px.

**The Flat Reading Column Rule.** Content remains left-aligned and orderly. Centering is reserved for the final result.

## Elevation & Depth

The system is flat. Borders, background changes and spacing communicate hierarchy; cards do not use shadows. Sticky headers use a translucent background only to protect navigation while scrolling.

## Shapes

Controls and surfaces use compact radii from 4px to 10px. Article and sound lists remain unbounded rows, separated by 1px rules. Circles are limited to status dots and radio indicators.

**The Rule Before Box Rule.** Prefer a divider over wrapping content in a new container.

## Components

### Buttons

Buttons are compact, familiar controls rather than brand decoration. Primary buttons use Proof Green, an 8px radius and a 40px minimum height; mobile primary actions rise to 44px. Hover deepens the green, and keyboard focus uses a visible green outline.

### Navigation

The header contains only orientation and current utilities. Back navigation is a quiet text button. The selected sound is a compact utility entry on the home page.

### Article Rows

Each row contains its category, title, word count and one `练习` action. Rows are separated by rules, acquire only a faint tint on hover, and never become elevated cards.

### Sound Rows

Sound choices use a circular indicator, name, one-line description and selection label. Selected rows receive Soft Proof Green plus a 1px Proof Green outline.

### Typing Surface

The typing surface is a clean white sheet with a 1px Editing Rule border and a 10px radius. Pending text is muted, correct text is dark ink, errors are red with an underline, and the current character receives Highlighter Yellow. Paragraph breaks use a small `↵` key-like marker before the required Enter input.

## Do's and Don'ts

### Do:

- **Do** keep the current typing position visible and unmistakable.
- **Do** use rules, whitespace and restrained background shifts to organize content.
- **Do** keep controls at least 44px tall on mobile.
- **Do** preserve readable essay line lengths and clear focus states.

### Don't:

- **Don't** reintroduce warm paper grids, decorative circles, gradients or card shadows.
- **Don't** use yellow outside the current-character state.
- **Don't** add all-caps eyebrow labels or repeated marketing copy above headings.
- **Don't** let secondary interface chrome become larger than the article title or typing task.
