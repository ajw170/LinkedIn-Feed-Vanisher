// Firefox-specific: message listener and storage initialization.

// Listen for messages from the popup or background script.
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'setFeedState') {
    browser.storage.local.set({
      [STORAGE_KEY]: message.feedState,
      [LEGACY_STORAGE_KEY]: message.feedState?.blockNewsFeed,
    });
    applyState(message.feedState);
    return Promise.resolve({ success: true });
  } else if (message.action === 'setVanished') {
    const feedState = normalizeFeedState(null, message.vanished);
    browser.storage.local.set({
      [STORAGE_KEY]: feedState,
      [LEGACY_STORAGE_KEY]: feedState.blockNewsFeed,
    });
    applyState(feedState);
    return Promise.resolve({ success: true });
  } else if (message.action === 'getState') {
    return Promise.resolve({ feedState: getCurrentState() });
  }
});

// Load persisted state on page load (default: feed is vanished).
browser.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]).then((result) => {
  const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
  applyState(feedState);
});
