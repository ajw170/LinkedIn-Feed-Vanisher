const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'shared', 'content.shared.js');
const targets = [
  path.join(root, 'chrome', 'content.shared.js'),
  path.join(root, 'firefox', 'content.shared.js'),
];

const contents = fs.readFileSync(source, 'utf8');
for (const target of targets) {
  fs.writeFileSync(target, contents);
  console.log(`Synced ${path.relative(root, target)}`);
}

