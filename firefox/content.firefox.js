// Firefox-specific: message listener and storage initialization.

// Listen for messages from the popup or background script.
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'setVanished') {
    browser.storage.local.set({ [STORAGE_KEY]: message.vanished });
    applyState(message.vanished);
    return Promise.resolve({ success: true });
  } else if (message.action === 'getState') {
    return Promise.resolve({ vanished: !!document.getElementById(PLACEHOLDER_ID) });
  }
});

// Load persisted state on page load (default: feed is vanished).
browser.storage.local.get([STORAGE_KEY]).then((result) => {
  const vanished = result[STORAGE_KEY] !== false;
  applyState(vanished);
});
