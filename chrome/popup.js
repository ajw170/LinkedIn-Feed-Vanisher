// LinkedIn Feed Vanisher — Popup Script (Chrome)
// Handles the toggle UI and communicates with the content script.

const STORAGE_KEY = 'feedVanished';

const toggle = document.getElementById('toggle');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');

/** Update the popup UI to reflect the current state. */
function updateUI(vanished) {
  toggle.checked = vanished;

  if (vanished) {
    statusBadge.className = 'status-badge vanished';
    statusText.textContent = 'Feed is vanished 🎉';
  } else {
    statusBadge.className = 'status-badge visible';
    statusText.textContent = 'Feed is visible 👀';
  }
}

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

// Initialise the popup with the persisted state.
chrome.storage.local.get([STORAGE_KEY], (result) => {
  const vanished = result[STORAGE_KEY] !== false;
  updateUI(vanished);
});

// Handle toggle clicks.
toggle.addEventListener('change', () => {
  applyAndSave(toggle.checked);
});
