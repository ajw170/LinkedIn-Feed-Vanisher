> [!WARNING]
> **Work in progress:** This project is under active development and **not final**. Features, behavior, and instructions may change without notice.

# 🌀 LinkedIn Feed Vanisher

> **Say goodbye to the LinkedIn noise. Hello, focus.** ✨

[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a855f7?style=for-the-badge)](https://github.com/ajw170/LinkedIn-Feed-Vanisher/pulls)

## 🚀 I don't care about the technical details, just let me install the extension!

<div>

[![Firefox Add-ons](https://img.shields.io/badge/Firefox_Add--ons-Get_it_here-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/search/?q=LinkedIn%20Feed%20Vanisher)
&nbsp;&nbsp;
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Get_it_here-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/search/LinkedIn%20Feed%20Vanisher)

</div>

## 💗 Support
<a href="https://www.buymeacoffee.com/codevision" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me a Coffee" style="height: 50px !important;width: 180px !important;" ></a>

## 🌐 GitHub Pages microsite

This repository includes a **Jekyll-powered GitHub Pages microsite** in [`docs/`](docs/).

- GitHub Pages source folder: `docs/`
- Jekyll config: `docs/_config.yml`
- README-derived site data: `docs/_data/readme.json`
- Refresh the site data from `README.md`:
  ```bash
  npm run sync:pages
  ```

## 🎭 What Does It Do?

LinkedIn Feed Vanisher removes LinkedIn feed UI from the DOM and replaces it with a calm placeholder so you can focus on messaging, jobs, and profiles.

### ✨ Features

- 🚫 **Blocks the LinkedIn news feed**
- 🔕 **Supports a separate notifications-feed toggle**
- 💾 **Remembers feed preferences** across reloads
- 🔵 **Toolbar badge** reflects active/inactive blocker state
- 🌍 **Cross-browser build with WXT** (Manifest V3 baseline)

---

| Before 😩 | After 🎉 |
|---|---|
| AI-generated garbage | Clean Slate |
| Endless scrolling | Pure Focus |
| Notifications pulling you back in | You're in control of your attention |
| "Just one more post…" | Get in, do your thing, get out |

---

## 🧱 Architecture (WXT)

This project now uses **[WXT](https://wxt.dev/)** for cross-browser extension development.

- **Manifest V3 baseline** for all builds
- **TypeScript** entrypoints
- **`browser.*` API usage** via `webextension-polyfill` compatibility layer
- **Browser-specific manifest overrides** in `wxt.config.ts`

### Key directories

```text
LinkedIn-Feed-Vanisher/
├── entrypoints/
│   ├── background.ts          # Background logic (badge, install/init, listeners)
│   ├── content.ts             # Feed removal/restoration logic
│   └── popup/
│       ├── index.html         # Popup markup
│       ├── main.ts            # Popup state + messaging
│       └── style.css          # Popup styles
├── lib/
│   ├── feed-state.ts          # Shared storage keys/state helpers
│   └── background.ts          # Shared background helpers
├── public/
│   └── icons/                 # Static extension icons copied into build output
├── wxt.config.ts              # WXT config + manifest overrides
├── docs/                      # GitHub Pages microsite
└── scripts/sync-pages-data.js # README → docs/_data/readme.json sync
```

---

## ⚙️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ajw170/LinkedIn-Feed-Vanisher.git
   cd LinkedIn-Feed-Vanisher
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🧪 Build, run, and package

### Development

- Chrome/Chromium dev mode:
  ```bash
  npm run dev
  ```
- Firefox dev mode:
  ```bash
  npm run dev:firefox
  ```

WXT rebuilds on changes and writes output to `.output/`.

### Type-check

```bash
npm run typecheck
```

### Production builds

- Chrome build:
  ```bash
  npm run build:chrome
  ```
  Output folder: `.output/chrome-mv3/`

- Firefox build:
  ```bash
  npm run build:firefox
  ```
  Output folder: `.output/firefox-mv3/`

### Zip packages for release/deploy

- All targets:
  ```bash
  npm run zip
  ```
- Chrome only:
  ```bash
  npm run zip:chrome
  ```
- Firefox only:
  ```bash
  npm run zip:firefox
  ```

Zip artifacts are emitted by WXT under `.output/`.

### Clean build output

```bash
npm run clean
```

---

## 🚀 Installation

### Chrome / Edge / Brave

1. Clone this repository and install dependencies:
   ```bash
   git clone https://github.com/ajw170/LinkedIn-Feed-Vanisher.git
   cd LinkedIn-Feed-Vanisher
   npm install
   ```
2. Build the Chrome package:
   ```bash
   npm run build:chrome
   ```
3. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
4. Enable **Developer mode**
5. Click **Load unpacked**
6. Select `.output/chrome-mv3/`
> 💡 Use `npm run dev` for watch mode during development.

### Firefox

1. Clone this repository and install dependencies:
   ```bash
   git clone https://github.com/ajw170/LinkedIn-Feed-Vanisher.git
   cd LinkedIn-Feed-Vanisher
   npm install
   ```
2. Build the Firefox package:
   ```bash
   npm run build:firefox
   ```
3. Open `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on…**
5. Select `.output/firefox-mv3/manifest.json`
> 💡 Use `npm run dev:firefox` for watch mode during development.

---

## 🔧 Customization

To update selectors, edit `entrypoints/content.ts`:

- `NEWS_FEED_SELECTORS`
- `NOTIFICATIONS_FEED_SELECTORS`

Use browser DevTools to inspect current LinkedIn DOM selectors.

---

## 🤝 Contributing

Pull requests are welcome.

For extension changes:

1. Edit TypeScript in `entrypoints/` or shared utilities in `lib/`
2. Run `npm run typecheck`
3. Build the target browser (`npm run build:chrome` and/or `npm run build:firefox`)
4. Verify manually in browser

If `README.md` changes affect the microsite content, run:

```bash
npm run sync:pages
```

---

## 📜 License

MIT © [LinkedIn Feed Vanisher Contributors](https://github.com/ajw170/LinkedIn-Feed-Vanisher)

---

<p align="center">Made with 💜 to help you stay focused</p>
