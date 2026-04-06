> [!WARNING]
> **Work in progress:** This project is under active development and **not final**. Features, behavior, and instructions may change without notice.

# 🌀 LinkedIn Feed Vanisher

> **Say goodbye to the LinkedIn noise. Hello, focus.** ✨

[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a855f7?style=for-the-badge)](https://github.com/ajw170/LinkedIn-Feed-Vanisher/pulls)

## 🚀 I don't care about the technical details, just let me install the extension!

<div align="center">

[![Firefox Add-ons](https://img.shields.io/badge/Firefox_Add--ons-Get_it_here-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/search/?q=LinkedIn%20Feed%20Vanisher)
&nbsp;&nbsp;
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Get_it_here-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/search/LinkedIn%20Feed%20Vanisher)

</div>

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
├── shared/                        # Shared source files (browser-agnostic)
│   ├── content.shared.js          # Shared content-script logic
│   ├── popup.shared.js            # Shared popup constants + UI helpers
│   ├── background.shared.js       # Shared background constants + helpers
│   ├── popup.html                 # Popup HTML (identical for all browsers)
│   └── icons/                     # Extension icons (PNG, identical for all browsers)
│       ├── icon16.png / icon16-dim.png
│       ├── icon48.png / icon48-dim.png
│       └── icon128.png / icon128-dim.png
│
├── chrome/                        # Chrome / Chromium extension (Manifest V3)
│   ├── manifest.json              # Extension manifest (unique)
│   ├── jsconfig.json              # TypeScript/JS config (unique)
│   ├── content.chrome.js          # Chrome-specific content-script additions
│   ├── popup.chrome.js            # Chrome-specific popup additions
│   ├── background.chrome.js       # Chrome-specific background additions
│   │── content.js                 # ⚙️ Generated — do not edit directly
│   ├── popup.js                   # ⚙️ Generated — do not edit directly
│   ├── background.js              # ⚙️ Generated — do not edit directly
│   ├── popup.html                 # ⚙️ Generated — do not edit directly
│   └── icons/                     # ⚙️ Generated — do not edit directly
│
├── firefox/                       # Firefox extension (Manifest V2)
│   ├── manifest.json              # Extension manifest (unique)
│   ├── jsconfig.json              # TypeScript/JS config (unique)
│   ├── content.firefox.js         # Firefox-specific content-script additions
│   ├── popup.firefox.js           # Firefox-specific popup additions
│   ├── background.firefox.js      # Firefox-specific background additions
│   ├── content.js                 # ⚙️ Generated — do not edit directly
│   ├── popup.js                   # ⚙️ Generated — do not edit directly
│   ├── background.js              # ⚙️ Generated — do not edit directly
│   ├── popup.html                 # ⚙️ Generated — do not edit directly
│   └── icons/                     # ⚙️ Generated — do not edit directly
│
├── scripts/
│   └── sync-content-shared.js     # Generates browser-specific files from shared sources
│
└── README.md
```

### How the shared/generated structure works

Shared logic lives in `shared/`. Browser-specific code lives in `chrome/*.chrome.js` and `firefox/*.firefox.js` stub files. The sync script concatenates them into the complete extension files loaded by each browser.

To regenerate after editing shared or stub files:
```bash
npm run sync
```

> **Note:** The generated files (`.js`, `.html`, `icons/` in each browser folder) are committed to the repository so the extension can be loaded directly without running the sync script first.

The only files that require manual maintenance per-browser are `manifest.json`, `jsconfig.json`, and the `*.chrome.js` / `*.firefox.js` stubs.

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

2. Open Firefox and go to `about:debugging`
3. Click **"This Firefox"** in the left sidebar
4. Click **"Load Temporary Add-on…"**
5. Navigate to the **`firefox/`** folder and select **`manifest.json`**
6. The 🌀 icon will appear in your toolbar!

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

   First, install dependencies (one-time):
   ```bash
   npm install
   ```

   Then use one of these npm scripts:

   | Command | Browser | Watch Mode | Purpose |
   |---------|---------|-----------|---------|
   | `npm run sync` | — | — | Regenerate browser-specific files from shared sources |
   | `npm run firefox` | Firefox | ✅ Yes | Launch Firefox with live reload on file changes |
   | `npm run chrome` | Chromium | ✅ Yes | Launch Chrome/Edge/Brave with live reload on file changes |
   | `npm run firefox:run` | Firefox | ❌ No | One-time Firefox launch (no watch) |
   | `npm run chrome:run` | Chromium | ❌ No | One-time Chromium launch (no watch) |

   **Example:**
   ```bash
   npm run firefox    # Launches Firefox with auto-reload enabled
   npm run chrome     # Launches Chrome with auto-reload enabled
   ```

   **Notes:**
   - Watch mode is recommended for development — any file changes automatically reload the extension in the browser.
   - If `web-ext` can't find your browser automatically, you can pass an explicit binary path. See the [web-ext documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-run) for details.
   - If you prefer to use your existing profile instead of a temporary one, you can still do manual reloads:
     - **Chrome:** Go to `chrome://extensions/` and click the 🔄 refresh button on the extension card.
     - **Firefox:** Go to `about:debugging` and click **Reload** on the extension entry.

   **Manual reload (works everywhere)**
   - **Chrome:** After editing, go to `chrome://extensions/` and click the 🔄 refresh button on the extension card.
   - **Firefox (about:debugging):** Click **Reload** on the extension entry.

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

Want to hide (or show) additional LinkedIn elements? Open `shared/content.shared.js` and add CSS selectors to the `FEED_SELECTORS` array, then run `npm run sync` to regenerate the browser files:

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

Please keep the shared sources (`shared/`) updated for logic that applies to both browsers. Only put browser-specific code in the `*.chrome.js` / `*.firefox.js` stubs. Run `npm run sync` after any changes to regenerate the browser-specific extension files.

---

## 📜 License

MIT © [LinkedIn Feed Vanisher Contributors](https://github.com/ajw170/LinkedIn-Feed-Vanisher)

---

<p align="center">Made with 💜 to help you stay focused</p>