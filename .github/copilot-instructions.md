# Copilot Instructions

When running commands in the terminal, only use BASH commands.  Do not use Windows PowerShell commands.  /c/ referes to C:\ in BASH.  For example, to change to the C:\ directory, use `cd /c/` instead of `cd C:\`.

This repository contains two self-contained browser extension implementations: `chrome/` and `firefox/`.

When making functional changes, keep behavior aligned across both folders unless the difference is browser-specific.

Prefer small, direct edits that preserve the current no-build, no-shared-source structure.

Key files to review before changing behavior: `chrome/content.js`, `chrome/popup.js`, `chrome/background.js`, and their Firefox counterparts.

Answer as succinctly as possible.

If changes invalidate the assumptions in the instructions file, update the instructions file to refect the new behavior.

Update the README.md file to reflect any changes in behavior or installation instructions.  This can include instructions to run the app in a certain way.  If the README.md file is not up to date, update it to reflect the current state of the project.