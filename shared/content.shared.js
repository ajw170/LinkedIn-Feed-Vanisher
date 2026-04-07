// LinkedIn Feed Vanisher — Content Script
// Hides the LinkedIn news feed so you can browse without distraction.

const STORAGE_KEY = 'feedVanished';
const PLACEHOLDER_ID = 'lfv-tranquility-placeholder';
const LEGACY_STYLE_ID = 'lfv-hide-style';
const PLACEHOLDER_STYLE_ID = 'lfv-placeholder-style';

// CSS injected into the host page to style the feed placeholder.
// Colors mirror the LinkedIn-palette values defined in shared/popup.css.
const PLACEHOLDER_CSS = `
#lfv-tranquility-placeholder {
  margin: 24px 0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #0A66C2;
  background: #EAF4FF;
  border: 1px solid #C0D9F0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
`.trim();

// CSS selectors targeting the LinkedIn feed container and related elements.
// LinkedIn periodically updates its DOM, so multiple selectors are provided
// as fallbacks. Extend this list if new selectors are needed.
const FEED_SELECTORS = [
  '.scaffold-finite-scroll__content',
  '[data-finite-scroll-hotkey-context="FEED"]',
  '.feed-following-feed',
  '.feed-new-update-pill',
  '.news-module',
  '.feed-identity-module',
  '[data-field*="mainFeed"]',
  '[data-field*="mainfeed"]',
  '[componentkey*="mainFeed"]',
  '[componentkey*="mainfeed"]',
  '[data-componentkey*="mainFeed"]',
  '[data-componentkey*="mainfeed"]',
];

let removedFeed = null;
let keepVanished = false;
let feedObserver = null;

function startFeedObserver() {
  if (feedObserver) return;
  feedObserver = new MutationObserver(() => {
    if (keepVanished) hideFeed();
  });
  feedObserver.observe(document.documentElement, { childList: true, subtree: true });
}

function stopFeedObserver() {
  if (!feedObserver) return;
  feedObserver.disconnect();
  feedObserver = null;
}

function findFeedElement() {
  for (const selector of FEED_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function injectPlaceholderStyle() {
  if (document.getElementById(PLACEHOLDER_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PLACEHOLDER_STYLE_ID;
  style.textContent = PLACEHOLDER_CSS;
  document.head.appendChild(style);
}

function removePlaceholderStyle() {
  const style = document.getElementById(PLACEHOLDER_STYLE_ID);
  if (style) style.remove();
}

function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.id = PLACEHOLDER_ID;
  placeholder.textContent = 'Enjoy the calm without the feed!';
  return placeholder;
}

/** Remove the feed node and replace it with a calm placeholder message. */
function hideFeed() {
  if (document.getElementById(PLACEHOLDER_ID)) return;

  const legacyStyle = document.getElementById(LEGACY_STYLE_ID);
  if (legacyStyle) legacyStyle.remove();

  const feed = findFeedElement();
  if (!feed || !feed.parentNode) return;

  const parent = feed.parentNode;
  const nextSibling = feed.nextSibling;
  removedFeed = { node: feed, parent, nextSibling };
  parent.removeChild(feed);

  injectPlaceholderStyle();
  const placeholder = createPlaceholder();
  if (nextSibling && nextSibling.parentNode === parent) {
    parent.insertBefore(placeholder, nextSibling);
  } else {
    parent.appendChild(placeholder);
  }
}

/** Remove the placeholder and reinsert the original feed node. */
function showFeed() {
  const placeholder = document.getElementById(PLACEHOLDER_ID);

  if (removedFeed && removedFeed.parent) {
    const { node, parent, nextSibling } = removedFeed;
    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(node, nextSibling);
    } else {
      parent.appendChild(node);
    }
    removedFeed = null;
  }

  if (placeholder) placeholder.remove();
  removePlaceholderStyle();
}

/** Apply vanished/visible state. */
function applyState(vanished) {
  keepVanished = vanished;
  if (vanished) {
    startFeedObserver();
    hideFeed();
  } else {
    stopFeedObserver();
    showFeed();
  }
}
