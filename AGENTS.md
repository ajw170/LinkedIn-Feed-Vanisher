# AGENTS.md

## What this repo is
- This repository contains **two separate browser-extension builds** of the same product: `chrome/` for Chromium browsers and `firefox/` for Firefox.
- Common logic lives in `shared/`; browser-specific code lives in `*.chrome.js` / `*.firefox.js` stubs inside each browser folder. A Node script (`scripts/sync-content-shared.js`) assembles the complete extension files.
- The main design choice is simplicity: the extension hides LinkedIn UI by **removing the feed node from the DOM and replacing it with a placeholder**, not by CSS injection or DOM polling.

## Architecture and message flow
- `content.js` is the feature engine. It reads `feedVanished` from extension storage and removes/restores the feed node in the DOM.
- `popup.js` is the control surface. It updates the popup UI, persists the new state, sends `{ action: 'setVanished', vanished }` to the active tab, then sends `{ action: 'stateChanged', vanished }` to the background script.
- `background.js` only manages the toolbar badge (`✓` with purple background when active).
- Example state/action contract used across the repo:
  - storage key: `feedVanished`
  - content messages: `setVanished`, `getState`
  - background message: `stateChanged`

## Shared vs browser-specific split
- `shared/content.shared.js` — all content-script logic except the message listener and storage call.
- `shared/popup.shared.js` — `STORAGE_KEY`, DOM element references, and `updateUI`.
- `shared/background.shared.js` — `STORAGE_KEY`, `LINKEDIN_HOST`, `ICON_PATHS`, and `isLinkedInUrl`.
- `shared/popup.html` and `shared/icons/` — identical assets for all browsers.
- `chrome/content.chrome.js`, `chrome/popup.chrome.js`, `chrome/background.chrome.js` — Chrome-specific code using `chrome.*` callback-based API.
- `firefox/content.firefox.js`, `firefox/popup.firefox.js`, `firefox/background.firefox.js` — Firefox-specific code using `browser.*` Promise-based API.

## Generated files
`scripts/sync-content-shared.js` concatenates each shared file with its browser-specific stub and copies HTML/icons into the browser folders. Run:
```
npm run sync
```
The generated `content.js`, `popup.js`, `background.js`, `popup.html`, and `icons/` in each browser folder are committed so the extension loads without needing to run sync first. **Do not edit them directly — edit the shared or stub sources instead.**

## Browser-specific boundaries
- Chrome uses **Manifest V3** in `chrome/manifest.json` with `background.service_worker` and the `chrome.*` API.
- Firefox uses **Manifest V2** in `firefox/manifest.json` with `background.scripts`, `browser_action`, and the `browser.*` Promise-based API.
- Keep behavior aligned while preserving API style. Do not "normalize" one side into the other unless you also update the manifest/runtime assumptions.

## Code patterns to preserve
- Default behavior is **feed hidden unless storage explicitly contains `false`**. See `result[STORAGE_KEY] !== false` in both `content.js`, `popup.js`, and `background.js`.
- Feed hiding is selector-driven via `FEED_SELECTORS` in `shared/content.shared.js`; update that array first when LinkedIn changes DOM structure, then run `npm run sync`.
- The popup HTML is in `shared/popup.html` and includes inline CSS plus fixed element ids: `toggle`, `statusBadge`, `statusText`.
- This repo favors tiny, direct scripts over abstraction.

## Working in this repo
- Manual load:
  - Chromium browsers: load the `chrome/` folder as an unpacked extension.
  - Firefox: load `firefox/manifest.json` from `about:debugging`.
- Optional dev loop from the README uses `web-ext`:
  - Firefox: `npm run firefox` (watch mode)
  - Chromium: `npm run chrome` (watch mode)
- After editing shared or stub sources, run `npm run sync` to regenerate the extension files.
- Debugging is browser-native:
  - popup issues: inspect the extension popup window
  - content-script issues: open DevTools on `https://www.linkedin.com/feed/`

## Change checklist for agents
- For shared logic changes: edit `shared/*.shared.js` or `shared/popup.html`, then run `npm run sync`.
- For browser-specific changes: edit the relevant `*.chrome.js` or `*.firefox.js` stub, then run `npm run sync`.
- Do **not** edit the generated files (`content.js`, `popup.js`, `background.js`, `popup.html`, `icons/`) inside the browser folders directly.
- If you add selectors or state handling, update the README examples only if they become inaccurate.
- When adjusting badge/popup behavior, trace the full loop: storage → popup UI → tab message → content script → background badge.

## Key files
- `README.md`
- `shared/content.shared.js`, `shared/popup.shared.js`, `shared/background.shared.js`, `shared/popup.html`, `shared/icons/`
- `chrome/manifest.json`, `chrome/jsconfig.json`, `chrome/content.chrome.js`, `chrome/popup.chrome.js`, `chrome/background.chrome.js`
- `firefox/manifest.json`, `firefox/jsconfig.json`, `firefox/content.firefox.js`, `firefox/popup.firefox.js`, `firefox/background.firefox.js`
- `scripts/sync-content-shared.js`
