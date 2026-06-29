import browser from 'webextension-polyfill';

export const LINKEDIN_HOST = 'linkedin.com';

export const ICON_PATHS = {
  illuminated: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  dim: {
    16: 'icons/icon16-dim.png',
    48: 'icons/icon48-dim.png',
    128: 'icons/icon128-dim.png',
  },
};

export function isLinkedInUrl(url?: string): boolean {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname;
    return hostname === LINKEDIN_HOST || hostname.endsWith(`.${LINKEDIN_HOST}`);
  } catch {
    return false;
  }
}

export function updateBadge(anyBlocked: boolean): void {
  browser.action.setBadgeText({ text: anyBlocked ? '✓' : '' });
  browser.action.setBadgeBackgroundColor({ color: anyBlocked ? '#0A66C2' : '#B0B0B0' });
}
