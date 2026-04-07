// LinkedIn Feed Vanisher — Background Script
// Handles extension lifecycle events and badge updates.

const STORAGE_KEY = 'feedVanished';
const LINKEDIN_HOST = 'linkedin.com';

const ICON_PATHS = {
  illuminated: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
  },
  dim: {
    16: 'icons/icon16-dim.png',
    48: 'icons/icon48-dim.png',
    128: 'icons/icon128-dim.png'
  }
};

function isLinkedInUrl(url) {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname;
    return hostname === LINKEDIN_HOST || hostname.endsWith(`.${LINKEDIN_HOST}`);
  } catch (_error) {
    return false;
  }
}

// Chrome-specific: badge updates and event listeners (Manifest V3).

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  chrome.action.setBadgeText({ text: vanished ? '✓' : '' });
  chrome.action.setBadgeBackgroundColor({ color: vanished ? '#0A66C2' : '#B0B0B0' });
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
