#!/usr/bin/env node
// scripts/sync-content-shared.js
//
// Generates the browser-specific extension files by combining shared sources
// with browser-specific code stubs, and copies shared assets (HTML, icons).
//
// Usage:
//   node scripts/sync-content-shared.js
//
// Source layout:
//   shared/content.shared.js      — shared content-script logic
//   shared/popup.shared.js        — shared popup logic
//   shared/background.shared.js   — shared background constants + helpers
//   shared/popup.html             — shared popup HTML (identical for all browsers)
//   shared/popup.css              — shared popup stylesheet (identical for all browsers)
//   shared/icons/                 — shared extension icons (identical for all browsers)
//
//   chrome/content.chrome.js      — Chrome-specific content-script additions
//   chrome/popup.chrome.js        — Chrome-specific popup additions
//   chrome/background.chrome.js   — Chrome-specific background additions
//
//   firefox/content.firefox.js    — Firefox-specific content-script additions
//   firefox/popup.firefox.js      — Firefox-specific popup additions
//   firefox/background.firefox.js — Firefox-specific background additions
//
// Generated output (committed so the extension loads without running this script):
//   chrome/content.js, chrome/popup.js, chrome/background.js
//   chrome/popup.html, chrome/popup.css, chrome/icons/
//   firefox/content.js, firefox/popup.js, firefox/background.js
//   firefox/popup.html, firefox/popup.css, firefox/icons/

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARED_DIR = path.join(ROOT, 'shared');
const BROWSERS = ['chrome', 'firefox'];

// JS files assembled from shared + browser-specific stub.
const JS_FILES = ['content', 'popup', 'background'];

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  wrote:  ${path.relative(ROOT, filePath)}`);
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`  copied: ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Combine a shared source file with a browser-specific stub into one output.
 * A single blank line separates the two parts.
 */
function combineJS(sharedFile, specificFile) {
  const shared = readFile(sharedFile).trimEnd();
  const specific = readFile(specificFile).trimStart();
  return `${shared}\n\n${specific}`;
}

function syncBrowser(browser) {
  console.log(`\nSyncing ${browser}/...`);
  const browserDir = path.join(ROOT, browser);

  // Assemble JS files from shared + browser-specific stubs.
  for (const name of JS_FILES) {
    const sharedFile = path.join(SHARED_DIR, `${name}.shared.js`);
    const specificFile = path.join(browserDir, `${name}.${browser}.js`);
    const outputFile = path.join(browserDir, `${name}.js`);
    writeFile(outputFile, combineJS(sharedFile, specificFile));
  }

  // Copy popup.html from shared/.
  const htmlSrc = path.join(SHARED_DIR, 'popup.html');
  const htmlDest = path.join(browserDir, 'popup.html');
  copyFile(htmlSrc, htmlDest);

  // Copy popup.css from shared/.
  const cssSrc = path.join(SHARED_DIR, 'popup.css');
  const cssDest = path.join(browserDir, 'popup.css');
  copyFile(cssSrc, cssDest);

  // Copy all icons from shared/icons/.
  const iconsDir = path.join(SHARED_DIR, 'icons');
  const destIconsDir = path.join(browserDir, 'icons');
  ensureDir(destIconsDir);
  for (const file of fs.readdirSync(iconsDir)) {
    copyFile(path.join(iconsDir, file), path.join(destIconsDir, file));
  }
}

for (const browser of BROWSERS) {
  syncBrowser(browser);
}

console.log('\nDone! Generated files are ready in chrome/ and firefox/.');
