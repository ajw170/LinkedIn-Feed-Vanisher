# Copilot Instructions

When running commands in the terminal, only use BASH commands.  Do not use Windows PowerShell commands.  /c/ referes to C:\ in BASH.  For example, to change to the C:\ directory, use `cd /c/` instead of `cd C:\`.

This repository contains two browser extension builds: `chrome/` and `firefox/`. Common logic lives in `shared/`; browser-specific additions live in `*.chrome.js` / `*.firefox.js` stubs inside each browser folder. The script `scripts/sync-content-shared.js` (run via `npm run sync`) assembles the complete extension files.

When making functional changes, edit the shared sources in `shared/` (for common logic) or the browser-specific stubs (for browser-specific code), then run `npm run sync` to regenerate the extension files. Do **not** edit the generated files (`content.js`, `popup.js`, `background.js`, `popup.html`, `icons/`) inside the browser folders directly.

Key files to review before changing behavior: `shared/content.shared.js`, `shared/popup.shared.js`, `shared/background.shared.js`, and the browser-specific stubs `chrome/content.chrome.js`, `firefox/content.firefox.js`, etc.

Answer as succinctly as possible.

If changes invalidate the assumptions in the instructions file, update the instructions file to reflect the new behavior.

Update the README.md file to reflect any changes in behavior or installation instructions.  This can include instructions to run the app in a certain way.  If the README.md file is not up to date, update it to reflect the current state of the project.
