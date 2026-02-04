import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';


export function useBookmarks() {
  const { user, signInWithGoogle } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate key based on user ID or guest status
  const bookmarksKey = useMemo(() => {
    const suffix = user ? user.id : 'guest';
    return `rss_reader_bookmarks_${suffix}`;
  }, [user]);

  // Load bookmarks whenever the key changes (user log in/out)
  useEffect(() => {
    setIsLoaded(false);
    try {
      const stored = localStorage.getItem(bookmarksKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setBookmarks([]);
    }
    setIsLoaded(true);
  }, [bookmarksKey]);

  // Save bookmarks whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Failed to save bookmarks:', error);
      }
    }
  }, [bookmarks, isLoaded, bookmarksKey]);

  const isBookmarked = useCallback((guid) => {
    return bookmarks.some(b => b.guid === guid);
  }, [bookmarks]);

  const addBookmark = useCallback((item, feedId, feedName) => {
    if (!user) return;

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
  }, [user, signInWithGoogle]);

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
    addBookmark,
    bookmarks,
    clearAllBookmarks,
    isBookmarked,
    isLoaded,
    removeBookmark,
    toggleBookmark,
  };

}
