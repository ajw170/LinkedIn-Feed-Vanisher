const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const readmePath = path.join(repoRoot, 'README.md');
const outputPath = path.join(repoRoot, 'docs', '_data', 'readme.json');
const HEADINGS = {
  quickInstall: '## 🚀 I don\'t care about the technical details, just let me install the extension!',
  support: '## 💗 Support',
  description: '## 🎭 What Does It Do?',
  features: '### ✨ Features',
  installation: '## 🚀 Installation',
  license: '## 📜 License',
};

const readme = fs.readFileSync(readmePath, 'utf8').replace(/\r\n/g, '\n');

function sectionBetween(startMarker, endMarker) {
  const startIndex = readme.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`Could not find section start: ${startMarker}`);
  }

  const contentStart = readme.indexOf('\n', startIndex) + 1;
  const endIndex = endMarker ? readme.indexOf(endMarker, contentStart) : readme.length;

  if (endMarker && endIndex === -1) {
    throw new Error(`Could not find section end: ${endMarker}`);
  }

  return readme.slice(contentStart, endIndex).trim();
}

function sectionForLevelTwoHeading(heading) {
  const startIndex = readme.indexOf(heading);

  if (startIndex === -1) {
    throw new Error(`Could not find heading: ${heading}`);
  }

  const contentStart = readme.indexOf('\n', startIndex) + 1;
  const remaining = readme.slice(contentStart);
  const nextHeadingMatch = remaining.match(/^##\s+.+$/m);
  const endIndex = nextHeadingMatch ? contentStart + nextHeadingMatch.index : readme.length;

  return readme.slice(contentStart, endIndex).trim();
}

function stripBlockquote(value) {
  return value
    .replace(/^>\s*/gm, '')
    .replace(/\*\*/g, '')
    .trim();
}

function cleanInline(value) {
  return value.replace(/^>\s*/, '').trim();
}

function parseTitle() {
  const match = readme.match(/^#\s+(.+)$/m);

  if (!match) {
    throw new Error('Could not find README title');
  }

  return match[1].trim();
}

function parseTagline() {
  const titleMatch = readme.match(/^#\s+.+$/m);

  if (!titleMatch) {
    throw new Error('Could not find README title block');
  }

  const afterTitle = readme.slice(titleMatch.index + titleMatch[0].length);
  const match = afterTitle.match(/^>\s+\*\*(.+?)\*\*(.*)$/m);

  if (!match) {
    throw new Error('Could not find README tagline');
  }

  return `${match[1]}${match[2]}`.trim();
}

function parseWarning() {
  const warningStart = readme.indexOf('> [!WARNING]');
  const titleMatch = readme.match(/^#\s+.+$/m);

  if (warningStart === -1 || !titleMatch) {
    return '';
  }

  return readme
    .slice(warningStart, titleMatch.index)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('>') && line !== '> [!WARNING]')
    .map((line) => stripBlockquote(line))
    .join(' ')
    .trim();
}

function parseQuickInstallLinks() {
  const section = sectionForLevelTwoHeading(HEADINGS.quickInstall);

  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('[!['))
    .map((line) => {
      const labelEnd = line.indexOf('](');
      const targetStart = line.lastIndexOf('](');
      const targetEnd = line.lastIndexOf(')');

      return {
        label: line.slice(3, labelEnd).trim(),
        url: line.slice(targetStart + 2, targetEnd).trim(),
      };
    });
}

function parseSupportUrl() {
  const section = sectionForLevelTwoHeading(HEADINGS.support);
  const match = section.match(/href="([^"]+)"/);
  return match ? match[1] : '';
}

function parseDescriptionAndComparison() {
  const section = sectionForLevelTwoHeading(HEADINGS.description);
  const [beforeTable] = section.split('| Before 😩 | After 🎉 |');
  const description = beforeTable
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith('### '));

  const tableLines = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('Before 😩'));

  const comparison = tableLines.map((line) => {
    const [before, after] = line
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean);

    return { before, after };
  });

  return { description, comparison };
}

function parseFeatures() {
  const section = sectionBetween(HEADINGS.features, '---');

  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function parseInstallation() {
  const section = sectionForLevelTwoHeading(HEADINGS.installation);
  const entries = section
    .split(/^###\s+/m)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.map((entry) => {
    const lines = entry.split('\n');
    const title = lines.shift().trim();
    const steps = [];
    const notes = [];

    for (const line of lines) {
      const stepMatch = line.match(/^\d+\.\s+(.*)$/);
      const noteMatch = line.match(/^>\s+(.*)$/);

      if (stepMatch) {
        steps.push(cleanInline(stepMatch[1]));
      } else if (noteMatch) {
        notes.push(cleanInline(noteMatch[1]));
      }
    }

    return { title, steps, notes };
  });
}

function parseLicense() {
  const section = sectionBetween(HEADINGS.license);

  return section
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && line !== '---' && !line.startsWith('<p '))
    || '';
}

const { description, comparison } = parseDescriptionAndComparison();

const data = {
  title: parseTitle(),
  tagline: parseTagline(),
  warning: parseWarning(),
  repository_url: 'https://github.com/ajw170/LinkedIn-Feed-Vanisher',
  readme_url: 'https://github.com/ajw170/LinkedIn-Feed-Vanisher/blob/main/README.md',
  install_links: parseQuickInstallLinks(),
  support_url: parseSupportUrl(),
  description,
  comparison,
  features: parseFeatures(),
  installation: parseInstallation(),
  license: parseLicense(),
};

fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${path.relative(repoRoot, outputPath)} from README.md`);
