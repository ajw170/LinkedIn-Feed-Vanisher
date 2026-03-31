> [!WARNING]
> **Work in progress:** This project is under active development and **not final**. Features, behavior, and instructions may change without notice.

# 🌀 LinkedIn Feed Vanisher

> **Say goodbye to the LinkedIn noise. Hello, focus.** ✨

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](chrome/)
[![Firefox](https://img.shields.io/badge/Firefox-Extension-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](firefox/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a855f7?style=for-the-badge)](https://github.com/ajw170/LinkedIn-Feed-Vanisher/pulls)

## I don't care about the technical details, just let me install the extension!

---
- **Firefox Add-ons (AMO):** https://addons.mozilla.org/firefox/search/?q=LinkedIn%20Feed%20Vanisher
- **Chrome Web Store:** https://chromewebstore.google.com/search/LinkedIn%20Feed%20Vanisher
---

## 🎭 What Does It Do?

LinkedIn is a fantastic networking tool — but that **infinite scrolling news feed** is a productivity black hole. Endless posts, humble-brags, and AI-generated "thought leadership" can derail your entire afternoon.

**LinkedIn Feed Vanisher** is a lightweight browser extension that makes the feed _disappear_ with a single click. Use LinkedIn for what it's actually good for — messaging, jobs, profiles — without the distraction of the feed.

| Before 😩 | After 🎉 |
|---|---|
| AI-generated garbage | Clean Slate |
| Endless scrolling | Pure Focus |
| Notifications pulling you back in | You're in control of your attention |
| "Just one more post…" | Get in, do your thing, get out |

### ✨ Features

- 🚫 **Hides the LinkedIn news feed** on `linkedin.com/feed/` and the home page
- 🔘 **One-click toggle** via the browser toolbar popup
- 💾 **Remembers your preference** — feed stays hidden across page reloads
- 🟣 **Badge indicator** on the toolbar icon shows active/inactive state
- 🦊 **Firefox** (Manifest V2) and 🟡 **Chrome/Chromium** (Manifest V3) supported

---

## 📁 Repository Structure

```
LinkedIn-Feed-Vanisher/
├── chrome/                  # Chrome / Chromium extension (Manifest V3)
│   ├── manifest.json        # Extension manifest
│   ├── content.js           # Content script — hides the feed
│   ├── background.js        # Service worker — badge updates
│   ├── popup.html           # Toolbar popup UI
│   ├── popup.js             # Popup logic
│   └── icons/               # Extension icons (PNG)
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
│
├── firefox/                 # Firefox extension (Manifest V2)
│   ├── manifest.json        # Extension manifest
│   ├── content.js           # Content script — hides the feed
│   ├── background.js        # Background script — badge updates
│   ├── popup.html           # Toolbar popup UI
│   ├── popup.js             # Popup logic
│   └── icons/               # Extension icons (PNG)
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
│
└── README.md
```

The Chrome and Firefox folders are **fully self-contained** — each can be loaded directly into the respective browser as an unpacked extension. Shared logic is intentionally kept consistent between the two, with browser-specific API calls (`chrome.*` vs `browser.*`) used where required.

---

## 🚀 Installation

### 🟡 Chrome / Chromium / Edge / Brave

1. **Download or clone** this repository:
   ```bash
   git clone https://github.com/ajw170/LinkedIn-Feed-Vanisher.git
   ```
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select the **`chrome/`** folder from the cloned repository
6. The 🌀 icon will appear in your toolbar. Click it to toggle the feed!

> 💡 **Edge:** Go to `edge://extensions/` and follow the same steps.
> 💡 **Brave:** Go to `brave://extensions/` and follow the same steps.

---

### 🦊 Firefox

1. **Download or clone** this repository:
   ```bash
   git clone https://github.com/ajw170/LinkedIn-Feed-Vanisher.git
   ```

#### Option A — Temporary load (no restart required, resets on browser restart)

1. Open Firefox and go to `about:debugging`
2. Click **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on…"**
4. Navigate to the **`firefox/`** folder and select **`manifest.json`**
5. The 🌀 icon will appear in your toolbar!

#### Option B — Temporary dev profile via `web-ext`

1. Install `web-ext`:
   ```bash
   npm install -g web-ext
   ```
2. Run from the `firefox/` directory:
   ```bash
   cd firefox
   web-ext run
   ```
   This launches a temporary Firefox instance with the extension pre-loaded.

---

## 🖥️ Running & Editing in an IDE

### Recommended: VS Code

This project works great with [Visual Studio Code](https://code.visualstudio.com/).

1. **Open the project:**
   ```bash
   code LinkedIn-Feed-Vanisher/
   ```
   Or open the folder via **File → Open Folder…**

2. **Recommended extensions** (install from the Extensions panel `Ctrl+Shift+X`):
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — JavaScript linting
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — code formatting
   - [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview) — preview HTML popup files

3. **Edit files** in `chrome/` or `firefox/` depending on your target browser.

4. **Live-reload during development:**

   **Option A — Firefox (recommended): auto-reload via `web-ext`**
   ```bash
   npm install -g web-ext
   cd firefox
   web-ext run --watch
   ```

   **Option B — Chrome / Chromium (recommended): auto-reload via `web-ext`**

   `web-ext` can also launch Chromium-based browsers. Use the Chrome/Chromium build (Manifest V3) and target Chromium:
   ```bash
   npm install -g web-ext
   cd chrome
   web-ext run --target=chromium --watch
   ```

   Notes:
   - If `web-ext` can't find your browser automatically, pass an explicit binary path:
     - macOS: `--chromium-binary="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`
     - Linux (examples): `--chromium-binary=google-chrome` or `--chromium-binary=chromium`
     - Windows (examples): `--chromium-binary="C:\Program Files\Google\Chrome\Application\chrome.exe"`
   - If you prefer to use your existing profile instead of a temporary one, you can still do manual reloads in `chrome://extensions/`.

   **Option C — Manual reload (works everywhere)**
   - **Chrome:** After editing, go to `chrome://extensions/` and click the 🔄 refresh button on the extension card.
   - **Firefox (Temporary Add-on / about:debugging):** Click **Reload** on the extension entry.

5. **Inspect the popup:**
   - Right-click the extension toolbar icon → **"Inspect Popup"** (Chrome) or **"Inspect"** (Firefox)
   - This opens DevTools scoped to the popup window.

6. **Inspect the content script:**
   - Open `linkedin.com/feed/` in your browser
   - Open DevTools (`F12`) → **Console**
   - The content script runs in the page context; log statements appear here.

### WebStorm / IntelliJ IDEA

1. Open the project folder: **File → Open…**
2. Mark `chrome/` and `firefox/` as source roots if needed
3. Use the built-in terminal to run `web-ext run --watch` (Firefox) or `web-ext run --target=chromium --watch` (Chromium)

---

## 🛠️ How It Works

```
┌──────────────┐   toggle click   ┌───────────────┐   sendMessage   ┌─────────────────┐
│  popup.html  │ ───────────────► │   popup.js    │ ──────────────► │  content.js     │
│  (toolbar)   │                  │  (reads/saves │                  │  (injects CSS   │
└──────────────┘                  │   storage)    │                  │   to hide feed) │
                                  └───────────────┘                  └─────────────────┘
                                         │
                                         ▼ sendMessage
                                  ┌───────────────┐
                                  │ background.js │
                                  │ (updates badge│
                                  │  on toolbar)  │
                                  └───────────────┘
```

1. **`content.js`** is injected into every `linkedin.com` page. It reads the saved state from `chrome.storage.local` / `browser.storage.local` and injects a `<style>` tag that hides the feed with `display: none !important`.
2. **`popup.js`** renders the toggle switch. When you flip it, it saves the new state to storage and sends a message to the active tab's content script to apply or remove the CSS.
3. **`background.js`** listens for state-change events and updates the badge text on the toolbar icon so you always know the current state at a glance.

---

## 🔧 Customisation

Want to hide (or show) additional LinkedIn elements? Open `content.js` in the relevant browser folder and add CSS selectors to the `FEED_SELECTORS` array:

```js
const FEED_SELECTORS = [
  '.scaffold-finite-scroll__content',  // main feed container
  '[data-finite-scroll-hotkey-context="FEED"]',
  '.feed-following-feed',
  '.news-module',                      // "LinkedIn News" sidebar widget
  // ✏️ Add your own selectors here!
];
```

Use your browser's DevTools Inspector to find the right class names — LinkedIn updates them occasionally.

---

## 🤝 Contributing

Pull requests are welcome! 🎉

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-awesome-feature`
3. Commit your changes: `git commit -m 'feat: add my awesome feature'`
4. Push the branch: `git push origin feature/my-awesome-feature`
5. Open a Pull Request

Please keep Chrome (`chrome/`) and Firefox (`firefox/`) implementations in sync when making functional changes.

---

## 📜 License

MIT © [LinkedIn Feed Vanisher Contributors](https://github.com/ajw170/LinkedIn-Feed-Vanisher)

---

<p align="center">Made with 💜 to help you stay focused</p>