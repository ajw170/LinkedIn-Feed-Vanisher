// LinkedIn Feed Vanisher — Background Script (Firefox, Manifest V2)
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

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  browser.browserAction.setBadgeText({ text: vanished ? '✓' : '' });
  browser.browserAction.setBadgeBackgroundColor({ color: vanished ? '#8B5CF6' : '#6B7280' });
}

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

async function updateActionAppearance() {
  const result = await browser.storage.local.get([STORAGE_KEY]);
  const vanished = result[STORAGE_KEY] !== false;

  const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs[0];
  const shouldIlluminate = vanished && isLinkedInUrl(activeTab?.url);

  await browser.browserAction.setIcon({ path: shouldIlluminate ? ICON_PATHS.illuminated : ICON_PATHS.dim });
  updateBadge(vanished);
}

// Restore badge state when the background page loads.
updateActionAppearance();

// Listen for state-change messages from the popup.
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'stateChanged') {
    updateActionAppearance();
    return Promise.resolve({ success: true });
  }
});

browser.tabs.onActivated.addListener(() => {
  updateActionAppearance();
});

browser.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (tab.active && (changeInfo.url || changeInfo.status === 'complete')) {
    updateActionAppearance();
  }
});

browser.windows.onFocusChanged.addListener(() => {
  updateActionAppearance();
});

// Set default state on first install.
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.storage.local.set({ [STORAGE_KEY]: true }).then(() => {
      updateActionAppearance();
    });
    return;
  }

  updateActionAppearance();
});
