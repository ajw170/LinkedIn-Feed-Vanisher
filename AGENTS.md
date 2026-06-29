# AGENTS.md

## What this repo is
- This repository is a **WXT-based cross-browser extension project** for LinkedIn Feed Vanisher.
- The extension now uses a **Manifest V3 baseline** and **TypeScript** entrypoints.
- Cross-browser API calls are made through **`browser.*`** via `webextension-polyfill`.
- Browser-specific manifest differences are defined in `wxt.config.ts`.
- The repo also includes a Jekyll GitHub Pages microsite in `docs/`.

## Architecture and message flow
- `entrypoints/content.ts`
  - Runs on `https://www.linkedin.com/*`
  - Applies feed blocking/restoring based on persisted state
  - Handles `setFeedState`, `setVanished`, and `getState` messages
- `entrypoints/popup/main.ts`
  - Reads persisted feed state
  - Updates popup UI
  - Persists updates
  - Sends `{ action: 'setFeedState', feedState }` to content script
  - Sends `{ action: 'stateChanged', feedState }` to background
- `entrypoints/background.ts`
  - Manages badge/icon state based on active tab + feed state
  - Sets default state on install

Shared state constants/helpers live in `lib/feed-state.ts`.

## Core state contract
- storage key: `feedPreferences` (legacy key: `feedVanished`)
- state shape:
  - `{ blockNewsFeed: boolean, blockNotificationsFeed: boolean }`
- content messages:
  - `setFeedState`, `setVanished`, `getState`
- background message:
  - `stateChanged`

## Build system (WXT)
- Dev (Chrome): `npm run dev`
- Dev (Firefox): `npm run dev:firefox`
- Type-check: `npm run typecheck`
- Build (Chrome): `npm run build:chrome`
- Build (Firefox): `npm run build:firefox`
- Zip packages: `npm run zip`, `npm run zip:chrome`, `npm run zip:firefox`
- Clean output: `npm run clean`

WXT outputs build artifacts to `.output/`.

## Browser-specific boundaries
- Baseline manifest is MV3 in `wxt.config.ts`.
- Firefox-specific overrides (for example `browser_specific_settings.gecko`) are added conditionally in `wxt.config.ts`.
- Keep behavior aligned across browsers while preserving required manifest/platform differences.

## Code patterns to preserve
- News feed blocking default: `true`
- Notifications feed blocking default: `false`
- Selector-driven feed matching in `entrypoints/content.ts`:
  - `NEWS_FEED_SELECTORS`
  - `NOTIFICATIONS_FEED_SELECTORS`
- Feed hiding strategy: remove node from DOM and replace with placeholder

## Working in this repo
- Edit extension code in:
  - `entrypoints/`
  - `lib/`
  - `public/icons/` (icons only)
- Do not edit generated output in `.output/`.
- For popup style/color changes, follow `DESIGN.md` and edit `entrypoints/popup/style.css`.
- If `README.md` changes affect microsite content, run `npm run sync:pages`.

## Key files
- `README.md`
- `wxt.config.ts`
- `entrypoints/background.ts`
- `entrypoints/content.ts`
- `entrypoints/popup/index.html`
- `entrypoints/popup/main.ts`
- `entrypoints/popup/style.css`
- `lib/feed-state.ts`
- `lib/background.ts`
- `public/icons/*`
- `docs/_config.yml`, `docs/index.html`, `docs/_data/readme.json`, `docs/assets/site.css`
- `scripts/sync-pages-data.js`
