// Chrome-specific: badge updates and event listeners (Manifest V3).

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  chrome.action.setBadgeText({ text: vanished ? '✓' : '' });
  chrome.action.setBadgeBackgroundColor({ color: vanished ? '#8B5CF6' : '#6B7280' });
}

function updateActionAppearance() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const vanished = result[STORAGE_KEY] !== false;

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const shouldIlluminate = vanished && isLinkedInUrl(activeTab?.url);

      chrome.action.setIcon({ path: shouldIlluminate ? ICON_PATHS.illuminated : ICON_PATHS.dim });
      updateBadge(vanished);
    });
  });
}

// Restore badge state when the service worker wakes up.
updateActionAppearance();

// Listen for state-change messages from the popup.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'stateChanged') {
    updateActionAppearance();
    sendResponse({ success: true });
  }
  return true;
});

chrome.tabs.onActivated.addListener(() => {
  updateActionAppearance();
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (tab.active && (changeInfo.url || changeInfo.status === 'complete')) {
    updateActionAppearance();
  }
});

chrome.windows.onFocusChanged.addListener(() => {
  updateActionAppearance();
});

chrome.runtime.onStartup.addListener(() => {
  updateActionAppearance();
});

// Set default state on first install.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ [STORAGE_KEY]: true });
    updateActionAppearance();
    return;
  }

  updateActionAppearance();
});
