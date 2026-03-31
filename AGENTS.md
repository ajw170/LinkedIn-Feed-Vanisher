# AGENTS.md

## What this repo is
- This repository contains **two separate browser-extension builds** of the same product: `chrome/` for Chromium browsers and `firefox/` for Firefox.
- The folders are intentionally **fully self-contained**; there is no shared source directory or build step. Functional changes usually need to be applied in **both** trees.
- The main design choice is simplicity: the extension hides LinkedIn UI by **injecting CSS once**, not by DOM polling or framework code.

## Architecture and message flow
- `content.js` is the feature engine. It reads `feedVanished` from extension storage and injects/removes a `<style>` tag with id `lfv-hide-style`.
- `popup.js` is the control surface. It updates the popup UI, persists the new state, sends `{ action: 'setVanished', vanished }` to the active tab, then sends `{ action: 'stateChanged', vanished }` to the background script.
- `background.js` only manages the toolbar badge (`✓` with purple background when active).
- Example state/action contract used across the repo:
  - storage key: `feedVanished`
  - content messages: `setVanished`, `getState`
  - background message: `stateChanged`

## Browser-specific boundaries
- Chrome uses **Manifest V3** in `chrome/manifest.json` with `background.service_worker` and the `chrome.*` API.
- Firefox uses **Manifest V2** in `firefox/manifest.json` with `background.scripts`, `browser_action`, and the `browser.*` Promise-based API.
- Keep behavior aligned while preserving API style. Do not “normalize” one side into the other unless you also update the manifest/runtime assumptions.

## Code patterns to preserve
- Default behavior is **feed hidden unless storage explicitly contains `false`**. See `result[STORAGE_KEY] !== false` in both `content.js`, `popup.js`, and `background.js`.
- Feed hiding is selector-driven via `FEED_SELECTORS` in each `content.js`; update that array first when LinkedIn changes DOM structure.
- The popup HTML is duplicated in both browser folders and includes inline CSS plus fixed element ids: `toggle`, `statusBadge`, `statusText`.
- This repo favors tiny, direct scripts over abstraction. If you refactor, avoid introducing tooling/shared build infrastructure unless the task explicitly requires it.

## Working in this repo
- There is **no package manifest, bundler, or test suite** in the repo root. Typical work is editing raw extension files and reloading the extension in the browser.
- Manual load:
  - Chromium browsers: load the `chrome/` folder as an unpacked extension.
  - Firefox: load `firefox/manifest.json` from `about:debugging`.
- Optional dev loop from the README uses `web-ext`:
  - Firefox: run `web-ext run --watch` inside `firefox/`
  - Chromium: run `web-ext run --target=chromium --watch` inside `chrome/`
- Debugging is browser-native:
  - popup issues: inspect the extension popup window
  - content-script issues: open DevTools on `https://www.linkedin.com/feed/`

## Change checklist for agents
- If you change feature logic, mirror it across `chrome/` and `firefox/` unless the difference is explicitly browser-specific.
- If you add selectors or state handling, update the README examples only if they become inaccurate.
- When adjusting badge/popup behavior, trace the full loop: storage -> popup UI -> tab message -> content script -> background badge.
- Prefer minimal edits that preserve the current duplicated structure and existing naming.

## Key files
- `README.md`
- `chrome/manifest.json`, `chrome/content.js`, `chrome/popup.js`, `chrome/background.js`, `chrome/popup.html`
- `firefox/manifest.json`, `firefox/content.js`, `firefox/popup.js`, `firefox/background.js`, `firefox/popup.html`

