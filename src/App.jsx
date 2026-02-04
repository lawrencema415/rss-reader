import { useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { DEFAULT_FEEDS } from '@/constants/feeds';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useFeeds } from '@/hooks/useFeeds';
import RootLayout from '@/layouts/RootLayout';
import Bookmarks from '@/pages/Bookmarks';
import Feed from '@/pages/Feed';
import Story from '@/pages/Story';

import './App.css';

function App() {
  const { loading: authLoading, user } = useAuth();
  
  // Lift state for feeds and bookmarks to the top
  const { 
    allFeeds, 
    deleteUserFeed, 
    errors, 
    feedData, 
    fetchFeedData, 
    isLoading, 
    retryFeed,
    saveUserFeed
  } = useFeeds();

  const {
    addBookmark,
    bookmarks,
    clearAllBookmarks,
    isBookmarked,
    isLoaded,
    removeBookmark,
    toggleBookmark
  } = useBookmarks();

  // Modal states
  const [deletingFeed, setDeletingFeed] = useState(null);
  const [editingFeed, setEditingFeed] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

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
      await deleteUserFeed(deletingFeed.id);
      setDeletingFeed(null);
    }
  }, [deletingFeed, deleteUserFeed]);

  const sharedProps = {
    addBookmark,
    allFeeds,
    bookmarks,
    clearAllBookmarks,
    errors,
    feedData,
    fetchFeedData,
    handleAddFeed,
    handleDeleteFeed,
    handleEditFeed,
    isBookmarked,
    isLoaded,
    isLoading,
    removeBookmark,
    retryFeed,
    toggleBookmark,
    user
  };

  const layoutProps = {
    deletingFeed,
    editingFeed,
    isFormModalOpen,
    onConfirmDelete,
    saveUserFeed,
    setDeletingFeed,
    setEditingFeed,
    setIsFormModalOpen
  };


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#F04E23]" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <RootLayout {...layoutProps}>
        <Routes>
          <Route 
            index 
            element={<Navigate to={`/feed/${DEFAULT_FEEDS[0].id}`} replace />} 
          />
          <Route 
            path="feed/:feedId" 
            element={<Feed {...sharedProps} />} 
          />
          <Route 
            path="bookmarks" 
            element={<Bookmarks {...sharedProps} />} 
          />
          <Route 
            path="read/:slug" 
            element={<Story {...sharedProps} />} 
          />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
