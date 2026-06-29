export const STORAGE_KEY = 'feedPreferences';
export const LEGACY_STORAGE_KEY = 'feedVanished';

export type FeedState = {
  blockNewsFeed: boolean;
  blockNotificationsFeed: boolean;
};

export const DEFAULT_FEED_STATE: FeedState = {
  blockNewsFeed: true,
  blockNotificationsFeed: false,
};

export function normalizeFeedState(rawState: unknown, legacyVanished?: unknown): FeedState {
  if (rawState && typeof rawState === 'object') {
    const state = rawState as Partial<FeedState>;

    return {
      blockNewsFeed:
        typeof state.blockNewsFeed === 'boolean'
          ? state.blockNewsFeed
          : DEFAULT_FEED_STATE.blockNewsFeed,
      blockNotificationsFeed:
        typeof state.blockNotificationsFeed === 'boolean'
          ? state.blockNotificationsFeed
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

export function isAnyFeedBlocked(feedState: FeedState): boolean {
  return feedState.blockNewsFeed || feedState.blockNotificationsFeed;
}
