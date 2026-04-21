// Firefox-specific: badge updates and event listeners (Manifest V2).

/** Update the action badge to reflect the current vanished state. */
function updateBadge(vanished) {
  browser.browserAction.setBadgeText({ text: vanished ? '✓' : '' });
  browser.browserAction.setBadgeBackgroundColor({ color: vanished ? '#0A66C2' : '#B0B0B0' });
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
