// Chrome-specific: persist state, notify content script, update background.

/** Persist state, notify the content script, and update the background. */
function applyAndSave(vanished) {
  chrome.storage.local.set({ [STORAGE_KEY]: vanished });

  // Notify the active tab's content script.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setVanished', vanished });
    }
  });

  // Notify the background service worker to update the badge.
  chrome.runtime.sendMessage({ action: 'stateChanged', vanished });

  updateUI(vanished);
}

// Initialize the popup with the persisted state.
chrome.storage.local.get([STORAGE_KEY], (result) => {
  const vanished = result[STORAGE_KEY] !== false;
  updateUI(vanished);
});

// Handle toggle clicks.
toggle.addEventListener('change', () => {
  applyAndSave(toggle.checked);
});
