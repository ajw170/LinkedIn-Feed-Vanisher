#!/usr/bin/env node
// scripts/clean-packages.js
//
// Removes all generated files from the chrome.package/ and firefox.package/
// folders. Run this before a fresh sync or to reset the output directories.
//
// Usage:
//   node scripts/clean-packages.js

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_DIRS = ['chrome.package', 'firefox.package'];

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`  removed: ${path.relative(ROOT, dir)}/`);
  } else {
    console.log(`  skipped: ${path.relative(ROOT, dir)}/ (does not exist)`);
  }
}

console.log('Cleaning package folders...');
for (const name of PACKAGE_DIRS) {
  removeDir(path.join(ROOT, name));
}
console.log('Done.');
