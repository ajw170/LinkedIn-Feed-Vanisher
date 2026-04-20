#!/usr/bin/env node
// scripts/sync-content-shared.js
//
// Generates the browser-specific extension package files by combining shared
// sources with browser-specific code stubs, and copies shared assets (HTML,
// icons) plus browser-specific assets (manifest.json) into the package folders.
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
//   chrome_source/content.chrome.js      — Chrome-specific content-script additions
//   chrome_source/popup.chrome.js        — Chrome-specific popup additions
//   chrome_source/background.chrome.js   — Chrome-specific background additions
//   chrome_source/manifest.json          — Chrome extension manifest
//
//   firefox_source/content.firefox.js    — Firefox-specific content-script additions
//   firefox_source/popup.firefox.js      — Firefox-specific popup additions
//   firefox_source/background.firefox.js — Firefox-specific background additions
//   firefox_source/manifest.json         — Firefox extension manifest
//
// Generated output (written to package folders — do not edit directly):
//   chrome.package/content.js, chrome.package/popup.js, chrome.package/background.js
//   chrome.package/popup.html, chrome.package/popup.css, chrome.package/icons/
//   chrome.package/manifest.json
//   firefox.package/content.js, firefox.package/popup.js, firefox.package/background.js
//   firefox.package/popup.html, firefox.package/popup.css, firefox.package/icons/
//   firefox.package/manifest.json

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARED_DIR = path.join(ROOT, 'shared');

const BROWSERS = [
  { name: 'chrome',   sourceDir: 'chrome_source',   packageDir: 'chrome.package'   },
  { name: 'firefox',  sourceDir: 'firefox_source',  packageDir: 'firefox.package'  },
];

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

function syncBrowser({ name, sourceDir, packageDir }) {
  console.log(`\nSyncing ${packageDir}/...`);
  const sourcePath  = path.join(ROOT, sourceDir);
  const packagePath = path.join(ROOT, packageDir);
  ensureDir(packagePath);

  // Assemble JS files from shared + browser-specific stubs.
  for (const jsName of JS_FILES) {
    const sharedFile   = path.join(SHARED_DIR, `${jsName}.shared.js`);
    const specificFile = path.join(sourcePath,  `${jsName}.${name}.js`);
    const outputFile   = path.join(packagePath, `${jsName}.js`);
    writeFile(outputFile, combineJS(sharedFile, specificFile));
  }

  // Copy manifest.json from source folder.
  copyFile(path.join(sourcePath, 'manifest.json'), path.join(packagePath, 'manifest.json'));

  // Copy popup.html from shared/.
  copyFile(path.join(SHARED_DIR, 'popup.html'), path.join(packagePath, 'popup.html'));

  // Copy popup.css from shared/.
  copyFile(path.join(SHARED_DIR, 'popup.css'), path.join(packagePath, 'popup.css'));

  // Copy all icons from shared/icons/.
  const iconsDir     = path.join(SHARED_DIR, 'icons');
  const destIconsDir = path.join(packagePath, 'icons');
  ensureDir(destIconsDir);
  for (const file of fs.readdirSync(iconsDir)) {
    copyFile(path.join(iconsDir, file), path.join(destIconsDir, file));
  }
}

for (const browser of BROWSERS) {
  syncBrowser(browser);
}

console.log('\nDone! Generated files are ready in chrome.package/ and firefox.package/.');
