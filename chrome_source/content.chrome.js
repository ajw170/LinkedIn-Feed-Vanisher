// Chrome-specific: message listener and storage initialization.

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
