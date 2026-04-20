// Firefox-specific: persist state, notify content script, update background.

/** Persist state, notify the content script, and update the background. */
function applyAndSave(vanished) {
  browser.storage.local.set({ [STORAGE_KEY]: vanished });

  // Notify the active tab's content script.
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, { action: 'setVanished', vanished });
    }
  });

  // Notify the background script to update the badge.
  browser.runtime.sendMessage({ action: 'stateChanged', vanished });

  updateUI(vanished);
}

// Initialise the popup with the persisted state.
browser.storage.local.get([STORAGE_KEY]).then((result) => {
  const vanished = result[STORAGE_KEY] !== false;
  updateUI(vanished);
});

// Handle toggle clicks.
toggle.addEventListener('change', () => {
  applyAndSave(toggle.checked);
});
