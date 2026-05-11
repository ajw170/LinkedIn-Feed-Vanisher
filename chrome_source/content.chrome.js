// Chrome-specific: message listener and storage initialization.

// Listen for messages from the popup or background script.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'setFeedState') {
    applyState(message.feedState);
    sendResponse({ success: true });
  } else if (message.action === 'setVanished') {
    // Backward compatibility for older popup code paths.
    applyState(normalizeFeedState(null, message.vanished));
    sendResponse({ success: true });
  } else if (message.action === 'getState') {
    sendResponse({ feedState: getCurrentState() });
  }
  return true; // keep the message channel open for async responses
});

// Load persisted state on page load (default: feed is vanished).
chrome.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY], (result) => {
  const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
  applyState(feedState);
});
