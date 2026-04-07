# Design System — LinkedIn Feed Vanisher

This document defines the visual language, color palette, and styling conventions for the LinkedIn Feed Vanisher extension. It is the single source of truth for all design decisions.

---

## Color Palette

All colors are defined as CSS custom properties in `shared/popup.css`. **To change any color globally, update the variable in that file only** — the change will propagate to every element that references it.

### Primary Brand Colors

| Variable | Hex | Usage |
|---|---|---|
| `--color-primary` | `#0A66C2` | LinkedIn Blue — toggle ON, badge active state, links, logo background |
| `--color-primary-dark` | `#004182` | Darker blue — hover states for links and interactive elements |
| `--color-primary-light` | `#EAF4FF` | Light blue tint — active badge background, content-script placeholder background |

### Surface Colors

| Variable | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Main popup background, header background |
| `--color-surface` | `#F3F2EE` | Toggle row card background (LinkedIn page background color) |
| `--color-border` | `#D9D9D9` | All borders — header divider, toggle row, footer divider, badge borders |

### Typography

| Variable | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#1D2226` | Main labels, headings |
| `--color-text-secondary` | `#666666` | Subtext, descriptions |

### Toggle Switch

| Variable | Hex | Usage |
|---|---|---|
| `--color-toggle-off` | `#B0B0B0` | Slider track when feed is visible (OFF state) |
| `--color-toggle-thumb` | `#FFFFFF` | Circular thumb on the toggle switch |

*When checked (ON), the slider track uses `--color-primary`.*

### Status Badge

| Variable | Hex | Usage |
|---|---|---|
| `--color-badge-active-bg` | `#EAF4FF` | Badge background when feed is hidden |
| `--color-badge-active-border` | `#C0D9F0` | Badge border when feed is hidden |
| `--color-badge-active-text` | `#0A66C2` | Badge text when feed is hidden |
| `--color-badge-active-dot` | `#0A66C2` | Animated dot when feed is hidden |
| `--color-badge-idle-bg` | `#F0F0F0` | Badge background when feed is visible |
| `--color-badge-idle-border` | `#D9D9D9` | Badge border when feed is visible |
| `--color-badge-idle-text` | `#888888` | Badge text when feed is visible |
| `--color-badge-idle-dot` | `#B0B0B0` | Static dot when feed is visible |

### Links

| Variable | Hex | Usage |
|---|---|---|
| `--color-link` | `#0A66C2` | Footer link default color |
| `--color-link-hover` | `#004182` | Footer link hover color |

---

## Typography

- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Base size:** `14px`
- **Line height:** `1.4`

| Element | Size | Weight |
|---|---|---|
| Extension title (`h1`) | `14px` | `700` |
| Header subtext | `11px` | `400` |
| Toggle label (primary) | `13px` | `600` |
| Toggle label (secondary) | `11px` | `400` |
| Status badge text | `12px` | `600` |
| Footer link | `11px` | `400` |

---

## Spacing & Shape

| Variable | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Logo icon, small elements |
| `--radius-md` | `10px` | Toggle row card |
| `--radius-pill` | `20px` | Status badge |

**Layout padding:**
- Header: `14px 16px`
- Main content area: `14px 16px`
- Toggle row: `12px 14px`
- Footer: `8px 16px`

---

## Component Inventory

### Popup UI (`shared/popup.css`, `shared/popup.html`)

The popup consists of four regions:

1. **Header** — Logo icon (blue square with emoji), extension name, tagline.
2. **Main → Toggle Row** — Card with primary label, description, and iOS-style toggle switch.
3. **Main → Status Badge** — Pill badge showing feed state with an animated dot (when active).
4. **Footer** — Centered "View on GitHub" link.

### Content-Script Placeholder (`shared/content.shared.js`)

When the feed is hidden, a plain `<div>` placeholder is injected using inline styles (no external stylesheet, since content scripts run in the LinkedIn page context). The placeholder uses colors that match the active palette:

| Property | Value |
|---|---|
| Background | `#EAF4FF` (`--color-primary-light`) |
| Border | `1px solid #C0D9F0` |
| Text color | `#0A66C2` (`--color-primary`) |
| Border radius | `8px` |
| Font | Same font stack as popup |

### Toolbar Badge (`chrome/background.chrome.js`, `firefox/background.firefox.js`)

| State | Color |
|---|---|
| Feed hidden (active) | `#0A66C2` — LinkedIn Blue |
| Feed visible (inactive) | `#B0B0B0` — neutral gray |

---

## Design Principles

1. **Single source of truth** — All colors are CSS custom properties at the top of `shared/popup.css`. Do not hard-code hex values outside of that `:root` block or the two background scripts that set the badge color (which must use hex strings per the extension API).

2. **LinkedIn palette alignment** — The extension mirrors LinkedIn's own visual language: white backgrounds, LinkedIn Blue (`#0A66C2`) as the primary action color, and `#F3F2EE` as the page-level surface color.

3. **No frameworks** — Plain CSS with custom properties only. No preprocessors, no bundler required.

4. **No dark purple** — The previous purple gradient (`#1e1b4b → #312e81 → #4c1d95`) and all purple/violet accent colors (`#8b5cf6`, `#a78bfa`, `#c4b5fd`, etc.) have been replaced. Do not reintroduce them.

5. **Professional & neutral** — Avoid playful gradients, glows, or oversaturated colors. Prefer subtle borders and tints over vivid backgrounds.

---

## How to Make a Color Change

1. Open `shared/popup.css`.
2. Locate the `:root` block at the top of the file.
3. Update the relevant CSS variable value.
4. For badge colors only, also update the matching hex in `chrome/background.chrome.js` and `firefox/background.firefox.js` (the two `setBadgeBackgroundColor` calls).
5. For placeholder colors only, update the inline style strings in `shared/content.shared.js` (`createPlaceholder`).
6. Run `npm run sync` to propagate changes to the browser folders.

---

## Files Reference

| File | Role |
|---|---|
| `shared/popup.css` | **Primary style source** — all CSS custom properties and popup component styles |
| `shared/popup.html` | Popup markup — references `popup.css` via `<link>` |
| `shared/content.shared.js` | Content script — inline styles for the placeholder use the same color values |
| `chrome/background.chrome.js` | Badge color via `chrome.action.setBadgeBackgroundColor` |
| `firefox/background.firefox.js` | Badge color via `browser.browserAction.setBadgeBackgroundColor` |
