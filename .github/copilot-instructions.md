# Copilot Instructions

This repository contains two self-contained browser extension implementations: `chrome/` and `firefox/`.

When making functional changes, keep behavior aligned across both folders unless the difference is browser-specific.

Prefer small, direct edits that preserve the current no-build, no-shared-source structure.

Key files to review before changing behavior: `chrome/content.js`, `chrome/popup.js`, `chrome/background.js`, and their Firefox counterparts.

Answer as succinctly as possible.

If changes invalidate the assumptions in the instructions file, update the instructions file to refect the new behavior.