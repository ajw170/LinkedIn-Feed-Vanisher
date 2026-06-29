import browser from 'webextension-polyfill';
import { defineContentScript } from 'wxt/utils/define-content-script';
import {
  DEFAULT_FEED_STATE,
  isAnyFeedBlocked,
  LEGACY_STORAGE_KEY,
  type FeedState,
  normalizeFeedState,
  STORAGE_KEY,
} from '../lib/feed-state';

const NEWS_PLACEHOLDER_ID = 'lfv-tranquility-placeholder-news';
const NOTIFICATIONS_PLACEHOLDER_ID = 'lfv-tranquility-placeholder-notifications';
const LEGACY_STYLE_ID = 'lfv-hide-style';
const PLACEHOLDER_STYLE_ID = 'lfv-placeholder-style';

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

type FeedType = keyof typeof FEED_DEFINITIONS;

type RemovedFeed = {
  node: Element;
  parent: Node;
  nextSibling: ChildNode | null;
};

let removedFeeds: Record<FeedType, RemovedFeed | null> = {
  news: null,
  notifications: null,
};

let keepVanished: FeedState = { ...DEFAULT_FEED_STATE };
let feedObserver: MutationObserver | null = null;

function getCurrentState(): FeedState {
  return { ...keepVanished };
}

function startFeedObserver() {
  if (feedObserver) {
    return;
  }

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
  if (!feedObserver) {
    return;
  }

  feedObserver.disconnect();
  feedObserver = null;
}

function findFeedElement(selectors: string[]): Element | null {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }

  return null;
}

function injectPlaceholderStyle() {
  if (document.getElementById(PLACEHOLDER_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = PLACEHOLDER_STYLE_ID;
  style.textContent = PLACEHOLDER_CSS;
  document.head.appendChild(style);
}

function removePlaceholderStyle() {
  document.getElementById(PLACEHOLDER_STYLE_ID)?.remove();
}

function createPlaceholder(placeholderId: string, placeholderText: string): HTMLDivElement {
  const placeholder = document.createElement('div');
  placeholder.id = placeholderId;
  placeholder.className = 'lfv-tranquility-placeholder';
  placeholder.textContent = placeholderText;
  return placeholder;
}

function hasPlaceholderInDom(): boolean {
  return Boolean(
    document.getElementById(NEWS_PLACEHOLDER_ID) || document.getElementById(NOTIFICATIONS_PLACEHOLDER_ID),
  );
}

function getTopLevelNodeHtml(node: Element | null): string {
  if (!node || typeof node.cloneNode !== 'function') {
    return '<unknown-node />';
  }

  return (node.cloneNode(false) as Element).outerHTML;
}

function hideFeed(feedType: FeedType) {
  const definition = FEED_DEFINITIONS[feedType];
  if (document.getElementById(definition.placeholderId)) {
    return;
  }

  document.getElementById(LEGACY_STYLE_ID)?.remove();

  const feed = findFeedElement(definition.selectors);
  if (!feed || !feed.parentNode) {
    return;
  }

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

function showFeed(feedType: FeedType) {
  const definition = FEED_DEFINITIONS[feedType];
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

  placeholder?.remove();

  if (!hasPlaceholderInDom()) {
    removePlaceholderStyle();
  }
}

function applyState(feedState: FeedState) {
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

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  runAt: 'document_end',
  main() {
    browser.runtime.onMessage.addListener((rawMessage: unknown) => {
      const message = rawMessage as { action?: string; feedState?: FeedState; vanished?: boolean };
      if (message.action === 'setFeedState' && message.feedState) {
        applyState(message.feedState);
        return Promise.resolve({ success: true });
      }

      if (message.action === 'setVanished') {
        applyState(normalizeFeedState(null, message.vanished));
        return Promise.resolve({ success: true });
      }

      if (message.action === 'getState') {
        return Promise.resolve({ feedState: getCurrentState() });
      }

      return false;
    });

    browser.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]).then((result) => {
      const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
      applyState(feedState);
    });
  },
});
