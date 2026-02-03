// added to provide Autocomplete/IntelliSense in IDE

/**
 * @typedef {Object} RSSItem
 * @property {string} title
 * @property {string} link
 * @property {string} description
 * @property {string} pubDate
 * @property {string} [author]
 * @property {string} [content]
 * @property {string} [guid]
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} RSSFeed
 * @property {string} title
 * @property {string} description
 * @property {string} link
 * @property {RSSItem[]} items
 */

/**
 * @typedef {Object} FeedSource
 * @property {string} id
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {RSSItem & { feedId: string, feedName: string, bookmarkedAt: string }} BookmarkedStory
 */

export {};
