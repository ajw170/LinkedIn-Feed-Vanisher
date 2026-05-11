// LinkedIn Feed Vanisher — Background Script
// Handles extension lifecycle events and badge updates.

const STORAGE_KEY = 'feedPreferences';
const LEGACY_STORAGE_KEY = 'feedVanished';
const LINKEDIN_HOST = 'linkedin.com';

const DEFAULT_FEED_STATE = {
  blockNewsFeed: true,
  blockNotificationsFeed: false,
};

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

