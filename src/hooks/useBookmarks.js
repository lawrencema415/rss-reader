import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'rss_reader_bookmarks';

/**
 * @typedef {import('@/types/rss').BookmarkedStory} BookmarkedStory
 * @typedef {import('@/types/rss').RSSItem} RSSItem
 */

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setBookmarks([]);
    }
    setIsLoaded(true);
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Failed to save bookmarks:', error);
      }
    }
  }, [bookmarks, isLoaded]);

  const isBookmarked = useCallback((guid) => {
    return bookmarks.some(b => b.guid === guid);
  }, [bookmarks]);

  const addBookmark = useCallback((item, feedId, feedName) => {
    setBookmarks(prev => {
      if (prev.some(b => b.guid === item.guid)) return prev;
      const newBookmark = {
        ...item,
        feedId,
        feedName,
        bookmarkedAt: new Date().toISOString(),
      };
      return [newBookmark, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((guid) => {
    setBookmarks(prev => prev.filter(b => b.guid !== guid));
  }, []);

  const toggleBookmark = useCallback((item, feedId, feedName) => {
    if (isBookmarked(item.guid || '')) {
      removeBookmark(item.guid || '');
    } else {
      addBookmark(item, feedId, feedName);
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isLoaded,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks,
  };
}
