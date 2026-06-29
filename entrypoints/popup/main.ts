import browser from 'webextension-polyfill';
import {
  LEGACY_STORAGE_KEY,
  type FeedState,
  normalizeFeedState,
  STORAGE_KEY,
} from '../../lib/feed-state';

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required popup element: ${id}`);
  }

  return element as T;
}

const newsToggle = getRequiredElement<HTMLInputElement>('newsToggle');
const notificationsToggle = getRequiredElement<HTMLInputElement>('notificationsToggle');
const statusBadge = getRequiredElement<HTMLDivElement>('statusBadge');
const statusText = getRequiredElement<HTMLSpanElement>('statusText');

function isAnyFeedBlocked(feedState: FeedState): boolean {
  return feedState.blockNewsFeed || feedState.blockNotificationsFeed;
}

function getFeedStateFromUI(): FeedState {
  return {
    blockNewsFeed: newsToggle.checked,
    blockNotificationsFeed: notificationsToggle.checked,
  };
}

function updateUI(feedState: FeedState) {
  newsToggle.checked = feedState.blockNewsFeed;
  notificationsToggle.checked = feedState.blockNotificationsFeed;

  if (isAnyFeedBlocked(feedState)) {
    statusBadge.className = 'status-badge vanished';
    statusText.textContent = 'Blocking one or more feeds';
    return;
  }

  statusBadge.className = 'status-badge visible';
  statusText.textContent = 'All feeds are visible';
}

async function applyAndSave(feedState: FeedState) {
  await browser.storage.local.set({
    [STORAGE_KEY]: feedState,
    [LEGACY_STORAGE_KEY]: feedState.blockNewsFeed,
  });

  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.id) {
    await browser.tabs.sendMessage(tabs[0].id, { action: 'setFeedState', feedState });
  }

  await browser.runtime.sendMessage({ action: 'stateChanged', feedState });
  updateUI(feedState);
}

browser.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]).then((result) => {
  const feedState = normalizeFeedState(result[STORAGE_KEY], result[LEGACY_STORAGE_KEY]);
  updateUI(feedState);
});

newsToggle.addEventListener('change', () => {
  void applyAndSave(getFeedStateFromUI());
});

notificationsToggle.addEventListener('change', () => {
  void applyAndSave(getFeedStateFromUI());
});
