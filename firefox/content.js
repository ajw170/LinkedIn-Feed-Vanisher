// LinkedIn Feed Vanisher — Content Script (Firefox)
// Hides the LinkedIn news feed so you can browse without distraction.

const STORAGE_KEY = 'feedVanished';
const STYLE_ID = 'lfv-hide-style';

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
];

/** Inject a <style> tag that hides all feed selectors. */
function hideFeed() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = FEED_SELECTORS
    .map((selector) => `${selector} { display: none !important; }`)
    .join('\n');
  (document.head || document.documentElement).appendChild(style);
}

/** Remove the injected <style> tag to reveal the feed again. */
function showFeed() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}

/** Apply vanished/visible state. */
function applyState(vanished) {
  if (vanished) {
    hideFeed();
  } else {
    showFeed();
  }
}

// Listen for messages from the popup or background script.
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'setVanished') {
    applyState(message.vanished);
    return Promise.resolve({ success: true });
  } else if (message.action === 'getState') {
    return Promise.resolve({ vanished: !!document.getElementById(STYLE_ID) });
  }
});

// Load persisted state on page load (default: feed is vanished).
browser.storage.local.get([STORAGE_KEY]).then((result) => {
  const vanished = result[STORAGE_KEY] !== false;
  applyState(vanished);
});
