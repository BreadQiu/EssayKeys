# EssayKeys v0.6.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the approved pure-white A×B home layout, remove the sound-trial completion counter, and publish version 0.6.0.

**Architecture:** Keep the existing React, hash-routing, typing and audio interfaces unchanged. Apply the visual hierarchy through the existing `HomePage` markup and shared CSS, then rebuild the checked-in `site/` output used by GitHub Pages.

**Tech Stack:** React, Vite, TypeScript, Vitest.

**Spec:** `DESIGN.md`

## Global Constraints

- Product title is exactly `EssayKeys`.
- Page background remains pure white.
- Home index heading is `选择一篇文章`.
- Home description is exactly `从第一个字符开始计时。`.
- Sound trial has no completion counter or restart message.
- Version is `0.6.0`.

## Review Focus

- Narrow iPad/mobile layouts must not overflow horizontally.
- The single yellow highlight remains the current typing character.
- Sound selection and automatic trial focus remain intact after removing the counter.
- The built `site/` output must contain the same version being tagged.
- GitHub Release creation must target the exact pushed commit.

### Task 1: Home hierarchy and sound-trial cleanup

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/components/HomePage.tsx`
- Modify: `src/components/SoundPickerPage.tsx`
- Modify: `src/styles.css`

- [x] Add failing tests for the new home copy and absent completion counter.
- [x] Run the focused tests and verify the expected failures.
- [x] Implement the masthead layout, clean home copy and counter removal.
- [x] Run the focused and full test suites.

### Task 2: Version, documentation and build

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `DESIGN.md`
- Build: `site/`

- [x] Update the project version to `0.6.0`.
- [x] Update the design documentation to the shipped home hierarchy.
- [x] Run TypeScript, tests and the production build.
- [x] Verify generated asset references and version metadata.

### Task 3: Release

**Files:**
- Create: Git commit, tag and GitHub Release

- [ ] Fetch and compare `origin/main`, preserving remote work.
- [ ] Commit the verified release and create tag `v0.6.0`.
- [ ] Push `main` and tag.
- [ ] Create GitHub Release `v0.6.0` with concise release notes.
- [ ] Verify the release URL and published asset references.
