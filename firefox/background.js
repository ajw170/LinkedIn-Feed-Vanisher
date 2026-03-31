// LinkedIn Feed Vanisher — Background Script (Firefox, Manifest V2)
// Handles extension lifecycle events and badge updates.

const STORAGE_KEY = 'feedVanished';

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  browser.browserAction.setBadgeText({ text: vanished ? '✓' : '' });
  browser.browserAction.setBadgeBackgroundColor({ color: vanished ? '#8B5CF6' : '#6B7280' });
}

// Restore badge state when the background page loads.
browser.storage.local.get([STORAGE_KEY]).then((result) => {
  const vanished = result[STORAGE_KEY] !== false;
  updateBadge(vanished);
});

// Listen for state-change messages from the popup.
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'stateChanged') {
    updateBadge(message.vanished);
    return Promise.resolve({ success: true });
  }
});

// Set default state on first install.
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.storage.local.set({ [STORAGE_KEY]: true });
    updateBadge(true);
  }
});
