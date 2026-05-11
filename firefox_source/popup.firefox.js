// Firefox-specific: persist state, notify content script, update background.

/** Persist state, notify the content script, and update the background. */
function applyAndSave(feedState) {
  browser.storage.local.set({
    [STORAGE_KEY]: feedState,
    [LEGACY_STORAGE_KEY]: feedState.blockNewsFeed,
  });

  // Notify the active tab's content script.
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, { action: 'setFeedState', feedState });
    }
  });

  // Notify the background script to update the badge.
  browser.runtime.sendMessage({ action: 'stateChanged', feedState });

  updateUI(feedState);
}

// Initialise the popup with the persisted state.
browser.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]).then((result) => {
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
