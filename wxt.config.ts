import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  manifestVersion: 3,
  manifest: ({ browser }) => ({
      name: 'LinkedIn Feed Vanisher',
      description: 'Make your LinkedIn feed vanish! Hide the noise and stay focused on what matters.',
      permissions: ['storage', 'activeTab', 'tabs'],
      host_permissions: ['https://www.linkedin.com/*'],
      action: {
        default_title: 'LinkedIn Feed Vanisher',
        default_icon: {
          '16': 'icons/icon16-dim.png',
          '48': 'icons/icon48-dim.png',
          '128': 'icons/icon128-dim.png',
        },
      },
      icons: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png',
      },
      browser_specific_settings:
        browser === 'firefox'
          ? {
              gecko: {
                id: 'linkedin-feed-vanisher@example.com',
                data_collection_permissions: {
                  required: ['none'],
                },
              },
            }
          : undefined,
  }),
});
