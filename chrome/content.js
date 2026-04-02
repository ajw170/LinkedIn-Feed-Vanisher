// LinkedIn Feed Vanisher — Content Script (Chrome)
// Hides the LinkedIn news feed so you can browse without distraction.

const STORAGE_KEY = 'feedVanished';
const PLACEHOLDER_ID = 'lfv-tranquility-placeholder';
const LEGACY_STYLE_ID = 'lfv-hide-style';

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

function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.id = PLACEHOLDER_ID;
  placeholder.textContent = 'Enjoy the calm without the feed!';
  placeholder.style.cssText = [
    'margin: 24px 0',
    'padding: 20px',
    'border-radius: 12px',
    'text-align: center',
    'font-size: 20px',
    'font-weight: 600',
    'color: #5e2ca5',
    'background: #f5f0ff',
    'border: 1px solid #e2d4ff',
  ].join(';');
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

// Listen for messages from the popup or background script.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'setVanished') {
    applyState(message.vanished);
    sendResponse({ success: true });
  } else if (message.action === 'getState') {
    sendResponse({ vanished: !!document.getElementById(PLACEHOLDER_ID) });
  }
  return true; // keep the message channel open for async responses
});

// Load persisted state on page load (default: feed is vanished).
chrome.storage.local.get([STORAGE_KEY], (result) => {
  const vanished = result[STORAGE_KEY] !== false;
  applyState(vanished);
});
