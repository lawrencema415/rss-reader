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

/**
 * @typedef {Object} LayoutContext
 * @property {FeedSource[]} allFeeds
 * @property {Object.<string, RSSFeed>} feedData
 * @property {Object.<string, boolean>} isLoading
 * @property {Object.<string, string>} errors
 * @property {(feedId: string) => Promise<void>} fetchFeedData
 * @property {(feedId: string) => void} retryFeed
 * @property {() => void} handleAddFeed
 * @property {(feed: FeedSource) => void} handleEditFeed
 * @property {(feed: FeedSource) => void} handleDeleteFeed
 * @property {BookmarkedStory[]} bookmarks
 * @property {boolean} isLoaded
 * @property {(guid: string) => boolean} isBookmarked
 * @property {(item: RSSItem, feedId: string, feedName: string) => void} addBookmark
 * @property {(guid: string) => void} removeBookmark
 * @property {(item: RSSItem, feedId: string, feedName: string) => void} toggleBookmark
 * @property {() => void} clearAllBookmarks
 */

export {};
