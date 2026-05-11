// LinkedIn Feed Vanisher — Popup Script
// Handles the toggle UI and communicates with the content script.

const STORAGE_KEY = 'feedPreferences';
const LEGACY_STORAGE_KEY = 'feedVanished';

const DEFAULT_FEED_STATE = {
  blockNewsFeed: true,
  blockNotificationsFeed: false,
};

const newsToggle = document.getElementById('newsToggle');
const notificationsToggle = document.getElementById('notificationsToggle');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');

function normalizeFeedState(rawState, legacyVanished) {
  if (rawState && typeof rawState === 'object') {
    return {
      blockNewsFeed:
        typeof rawState.blockNewsFeed === 'boolean'
          ? rawState.blockNewsFeed
          : DEFAULT_FEED_STATE.blockNewsFeed,
      blockNotificationsFeed:
        typeof rawState.blockNotificationsFeed === 'boolean'
          ? rawState.blockNotificationsFeed
          : DEFAULT_FEED_STATE.blockNotificationsFeed,
    };
  }

  if (typeof legacyVanished === 'boolean') {
    return {
      blockNewsFeed: legacyVanished,
      blockNotificationsFeed: DEFAULT_FEED_STATE.blockNotificationsFeed,
    };
  }

  return { ...DEFAULT_FEED_STATE };
}

function isAnyFeedBlocked(feedState) {
  return feedState.blockNewsFeed || feedState.blockNotificationsFeed;
}

function getFeedStateFromUI() {
  return {
    blockNewsFeed: newsToggle.checked,
    blockNotificationsFeed: notificationsToggle.checked,
  };
}

/** Update the popup UI to reflect the current state. */
function updateUI(feedState) {
  newsToggle.checked = feedState.blockNewsFeed;
  notificationsToggle.checked = feedState.blockNotificationsFeed;

  if (isAnyFeedBlocked(feedState)) {
    statusBadge.className = 'status-badge vanished';
    statusText.textContent = 'Blocking one or more feeds';
  } else {
    statusBadge.className = 'status-badge visible';
    statusText.textContent = 'All feeds are visible';
  }
}
