// LinkedIn Feed Vanisher — Content Script
// Hides the LinkedIn news feed so you can browse without distraction.

const STORAGE_KEY = 'feedPreferences';
const LEGACY_STORAGE_KEY = 'feedVanished';
const NEWS_PLACEHOLDER_ID = 'lfv-tranquility-placeholder-news';
const NOTIFICATIONS_PLACEHOLDER_ID = 'lfv-tranquility-placeholder-notifications';
const LEGACY_STYLE_ID = 'lfv-hide-style';
const PLACEHOLDER_STYLE_ID = 'lfv-placeholder-style';

const DEFAULT_FEED_STATE = {
  blockNewsFeed: true,
  blockNotificationsFeed: false,
};

// CSS injected into the host page to style the feed placeholder.
// Colors mirror the LinkedIn-palette values defined in shared/popup.css.
const PLACEHOLDER_CSS = `
.lfv-tranquility-placeholder {
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
const NEWS_FEED_SELECTORS = [
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

// WIP: these selectors are expected to evolve as LinkedIn changes markup.
const NOTIFICATIONS_FEED_SELECTORS = [
  '[data-view-name="notifications-page"] .scaffold-finite-scroll__content',
  '.notifications .scaffold-finite-scroll__content',
  '.nt-card-list',
];

const FEED_DEFINITIONS = {
  news: {
    selectors: NEWS_FEED_SELECTORS,
    placeholderId: NEWS_PLACEHOLDER_ID,
    placeholderText: 'News feed blocked. Enjoy the calm.',
  },
  notifications: {
    selectors: NOTIFICATIONS_FEED_SELECTORS,
    placeholderId: NOTIFICATIONS_PLACEHOLDER_ID,
    placeholderText: 'Notifications feed blocked. Focus mode is on.',
  },
};

let removedFeeds = {
  news: null,
  notifications: null,
};

let keepVanished = { ...DEFAULT_FEED_STATE };
let feedObserver = null;

function normalizeFeedState(rawState, legacyVanished) {
  if (rawState && typeof rawState === 'object') {
    return {
      blockNewsFeed:
        typeof rawState.blockNewsFeed === 'boolean'
          ? rawState.blockNewsFeed
          : DEFAULT_FEED_STATE.blockNewsFeed,
      blockNotificationsFeed:
        typeof rawState.blockNotificationsFeed === 'boolean'
          ? rawState.blockNotificationsFeed
          : DEFAULT_FEED_STATE.blockNotificationsFeed,
    };
  }

  if (typeof legacyVanished === 'boolean') {
    return {
      blockNewsFeed: legacyVanished,
      blockNotificationsFeed: DEFAULT_FEED_STATE.blockNotificationsFeed,
    };
  }

  return { ...DEFAULT_FEED_STATE };
}

function isAnyFeedBlocked(feedState) {
  return feedState.blockNewsFeed || feedState.blockNotificationsFeed;
}

function getCurrentState() {
  return { ...keepVanished };
}

function startFeedObserver() {
  if (feedObserver) return;
  feedObserver = new MutationObserver(() => {
    if (keepVanished.blockNewsFeed) {
      hideFeed('news');
    }
    if (keepVanished.blockNotificationsFeed) {
      hideFeed('notifications');
    }
  });
  feedObserver.observe(document.documentElement, { childList: true, subtree: true });
}

function stopFeedObserver() {
  if (!feedObserver) return;
  feedObserver.disconnect();
  feedObserver = null;
}

function findFeedElement(selectors) {
  for (const selector of selectors) {
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

function createPlaceholder(placeholderId, placeholderText) {
  const placeholder = document.createElement('div');
  placeholder.id = placeholderId;
  placeholder.className = 'lfv-tranquility-placeholder';
  placeholder.textContent = placeholderText;
  return placeholder;
}

function hasPlaceholderInDom() {
  return Boolean(
    document.getElementById(NEWS_PLACEHOLDER_ID) ||
    document.getElementById(NOTIFICATIONS_PLACEHOLDER_ID)
  );
}

function getTopLevelNodeHtml(node) {
  if (!node || typeof node.cloneNode !== 'function') {
    return '<unknown-node />';
  }

  // cloneNode(false) preserves the top-level element + attributes only.
  return node.cloneNode(false).outerHTML;
}

/** Remove the feed node and replace it with a calm placeholder message. */
function hideFeed(feedType) {
  const definition = FEED_DEFINITIONS[feedType];
  if (!definition) return;

  if (document.getElementById(definition.placeholderId)) return;

  const legacyStyle = document.getElementById(LEGACY_STYLE_ID);
  if (legacyStyle) legacyStyle.remove();

  const feed = findFeedElement(definition.selectors);
  if (!feed || !feed.parentNode) return;

  const parent = feed.parentNode;
  const nextSibling = feed.nextSibling;
  removedFeeds[feedType] = { node: feed, parent, nextSibling };
  const topLevelHtml = getTopLevelNodeHtml(feed);
  parent.removeChild(feed);

  console.info(`[LFV] Removing ${feedType} feed node: ${topLevelHtml}`);

  injectPlaceholderStyle();
  const placeholder = createPlaceholder(definition.placeholderId, definition.placeholderText);
  if (nextSibling && nextSibling.parentNode === parent) {
    parent.insertBefore(placeholder, nextSibling);
  } else {
    parent.appendChild(placeholder);
  }
}

/** Remove the placeholder and reinsert the original feed node. */
function showFeed(feedType) {
  const definition = FEED_DEFINITIONS[feedType];
  if (!definition) return;

  const placeholder = document.getElementById(definition.placeholderId);

  if (removedFeeds[feedType] && removedFeeds[feedType].parent) {
    const { node, parent, nextSibling } = removedFeeds[feedType];
    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(node, nextSibling);
    } else {
      parent.appendChild(node);
    }
    removedFeeds[feedType] = null;
  }

  if (placeholder) placeholder.remove();
  if (!hasPlaceholderInDom()) {
    removePlaceholderStyle();
  }
}

/** Apply vanished/visible state. */
function applyState(feedState) {
  keepVanished = normalizeFeedState(feedState);

  if (isAnyFeedBlocked(keepVanished)) {
    startFeedObserver();
  } else {
    stopFeedObserver();
  }

  if (keepVanished.blockNewsFeed) {
    hideFeed('news');
  } else {
    showFeed('news');
  }

  if (keepVanished.blockNotificationsFeed) {
    hideFeed('notifications');
  } else {
    showFeed('notifications');
  }
}
