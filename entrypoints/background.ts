import browser from 'webextension-polyfill';
import { defineBackground } from 'wxt/utils/define-background';
import { ICON_PATHS, isLinkedInUrl, updateBadge } from '../lib/background';
import {
  DEFAULT_FEED_STATE,
  isAnyFeedBlocked,
  LEGACY_STORAGE_KEY,
  normalizeFeedState,
  STORAGE_KEY,
} from '../lib/feed-state';

async function updateActionAppearance() {
  const result = await browser.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]);
  const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
  const anyBlocked = isAnyFeedBlocked(feedState);

  const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs[0];
  const shouldIlluminate = anyBlocked && isLinkedInUrl(activeTab?.url);

  await browser.action.setIcon({ path: shouldIlluminate ? ICON_PATHS.illuminated : ICON_PATHS.dim });
  updateBadge(anyBlocked);
}

export default defineBackground(() => {
  updateActionAppearance();

  browser.runtime.onMessage.addListener((rawMessage: unknown) => {
    const message = rawMessage as { action?: string };
    if (message.action === 'stateChanged') {
      updateActionAppearance();
      return Promise.resolve({ success: true });
    }

    return false;
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

  browser.runtime.onStartup.addListener(() => {
    updateActionAppearance();
  });

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browser.storage.local
        .set({
          [STORAGE_KEY]: DEFAULT_FEED_STATE,
          [LEGACY_STORAGE_KEY]: DEFAULT_FEED_STATE.blockNewsFeed,
        })
        .then(() => {
          updateActionAppearance();
        });
      return;
    }

    updateActionAppearance();
  });
});
