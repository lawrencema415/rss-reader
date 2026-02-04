import { createContext, useCallback, useContext, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useBookmarks } from '@/hooks/useBookmarks';
import { useFeeds } from '@/hooks/useFeeds';


const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const match = useMatch('/feed/:feedId');
  const currentFeedId = match?.params?.feedId;

  const { 
    allFeeds,
    feedData,
    isLoading,
    errors,
    saveUserFeed,
    deleteUserFeed,
    fetchFeedData,
    retryFeed
  } = useFeeds();

  const {
    bookmarks,
    isLoaded,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks
  } = useBookmarks();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);
  const [deletingFeed, setDeletingFeed] = useState(null);

  const handleAddFeed = useCallback(() => {
    setEditingFeed(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEditFeed = useCallback((feed) => {
    setEditingFeed(feed);
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteFeed = useCallback((feed) => {
    setDeletingFeed(feed);
  }, []);

  const onConfirmDelete = useCallback(async () => {
    if (deletingFeed) {
      const idToDelete = deletingFeed.id;
      await deleteUserFeed(idToDelete);
      
      // If the user is currently viewing the feed being deleted, redirect home
      if (currentFeedId && currentFeedId.toString() === idToDelete.toString()) {
        navigate('/');
      }
      
      setDeletingFeed(null);
    }
  }, [deletingFeed, deleteUserFeed, currentFeedId, navigate]);

  const value = {
    addBookmark,
    allFeeds, 
    bookmarks,
    clearAllBookmarks,
    deletingFeed,
    editingFeed,
    errors, 
    feedData, 
    fetchFeedData, 
    handleAddFeed, 
    handleDeleteFeed,
    handleEditFeed, 
    isBookmarked,
    isFormModalOpen,
    isLoaded,
    onConfirmDelete,
    retryFeed,
    saveUserFeed,
    setDeletingFeed,
    setEditingFeed,
    setIsFormModalOpen,
    toggleBookmark,
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
