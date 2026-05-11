// Chrome-specific: persist state, notify content script, update background.

/** Persist state, notify the content script, and update the background. */
function applyAndSave(feedState) {
  chrome.storage.local.set({
    [STORAGE_KEY]: feedState,
    [LEGACY_STORAGE_KEY]: feedState.blockNewsFeed,
  });

  // Notify the active tab's content script.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setFeedState', feedState });
    }
  });

  // Notify the background service worker to update the badge.
  chrome.runtime.sendMessage({ action: 'stateChanged', feedState });

  updateUI(feedState);
}

// Initialize the popup with the persisted state.
chrome.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY], (result) => {
  const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
  updateUI(feedState);
});

// Handle toggle clicks.
newsToggle.addEventListener('change', () => {
  applyAndSave(getFeedStateFromUI());
});

notificationsToggle.addEventListener('change', () => {
  applyAndSave(getFeedStateFromUI());
});
