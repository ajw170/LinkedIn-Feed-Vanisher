// Shared content-script logic used by both Chrome and Firefox builds.
(function registerContentInitializer(globalScope) {
  function initLinkedInFeedVanisherContent(adapter) {
    const STORAGE_KEY = 'feedVanished';
    const PLACEHOLDER_ID = 'lfv-tranquility-placeholder';
    const LEGACY_STYLE_ID = 'lfv-hide-style';

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
      placeholder.textContent = 'ahhh ... tranquility';
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

    function showFeed() {
      const placeholder = document.getElementById(PLACEHOLDER_ID);

      if (removedFeed && removedFeed.parent && removedFeed.node) {
        const { node, parent, nextSibling } = removedFeed;
        if (parent.isConnected) {
          if (nextSibling && nextSibling.parentNode === parent) {
            parent.insertBefore(node, nextSibling);
          } else {
            parent.appendChild(node);
          }
        }
        removedFeed = null;
      }

      if (placeholder) placeholder.remove();
    }

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

    adapter.onMessage((message) => {
      if (message.action === 'setVanished') {
        return adapter.storageSet({ [STORAGE_KEY]: message.vanished }).then(() => {
          applyState(message.vanished);
          return { success: true };
        });
      }

      if (message.action === 'getState') {
        return { vanished: !!document.getElementById(PLACEHOLDER_ID) };
      }

      return undefined;
    });

    adapter.storageGet([STORAGE_KEY]).then((result) => {
      const vanished = result[STORAGE_KEY] !== false;
      applyState(vanished);
    });
  }

  globalScope.initLinkedInFeedVanisherContent = initLinkedInFeedVanisherContent;
})(globalThis);

