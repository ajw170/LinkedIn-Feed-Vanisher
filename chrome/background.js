// LinkedIn Feed Vanisher — Background Service Worker (Chrome, Manifest V3)
// Handles extension lifecycle events and badge updates.

const STORAGE_KEY = 'feedVanished';

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  chrome.action.setBadgeText({ text: vanished ? '✓' : '' });
  chrome.action.setBadgeBackgroundColor({ color: vanished ? '#8B5CF6' : '#6B7280' });
}

// Restore badge state when the service worker wakes up.
chrome.storage.local.get([STORAGE_KEY], (result) => {
  const vanished = result[STORAGE_KEY] !== false;
  updateBadge(vanished);
});

// Listen for state-change messages from the popup.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'stateChanged') {
    updateBadge(message.vanished);
    sendResponse({ success: true });
  }
  return true;
});

// Set default state on first install.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ [STORAGE_KEY]: true });
    updateBadge(true);
  }
});
