import {NavigationStyle} from "./lib/types";

export default {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '1a80dc8b81a84fae956979bdae7a0480',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  // rootNotionSpaceId: 'd56ea3a9-ac50-40dc-b77a-a59febed8ea9',

  // basic site info (required)
  name: 'Seeds',
  domain: 'notion-seeds.vercel.app',
  author: 'SEEDS Collective',

  // Navigation: should the first item be displayed as Title (e.g. as a main 'Home' link?)
  displayFirstLinkAsTitle: true,

  // open graph metadata (optional)
  description: 'SEEDS - for a regenerative world',
  socialImageTitle: 'SEEDS',
  socialImageSubtitle: 'Hello World! 👋',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/metagame-home': 'https://notion.so/7e28e75f3c264c7b939eaaa2239b9c28',
  },

  navigationStyle: 'custom' as NavigationStyle
}
