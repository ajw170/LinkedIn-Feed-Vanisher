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
