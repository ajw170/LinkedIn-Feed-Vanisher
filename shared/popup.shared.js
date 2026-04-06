// LinkedIn Feed Vanisher — Popup Script
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
