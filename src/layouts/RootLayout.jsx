import { useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import FeedFormModal from '@/components/FeedFormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useFeeds } from '@/hooks/useFeeds';
import { useBookmarks } from '@/hooks/useBookmarks';

const RootLayout = () => {
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

  const handleAddFeed = () => {
    setEditingFeed(null);
    setIsFormModalOpen(true);
  };

  const handleEditFeed = (feed) => {
    setEditingFeed(feed);
    setIsFormModalOpen(true);
  };

  const handleDeleteFeed = (feed) => {
    setDeletingFeed(feed);
  };

  const onConfirmDelete = async () => {
    if (deletingFeed) {
      const idToDelete = deletingFeed.id;
      await deleteUserFeed(idToDelete);
      
      // If the user is currently viewing the feed being deleted, redirect home
      if (currentFeedId && currentFeedId.toString() === idToDelete.toString()) {
        navigate('/');
      }
      
      setDeletingFeed(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-gray-50/50">
      <Outlet context={{ 
        allFeeds, 
        feedData, 
        isLoading, 
        errors, 
        fetchFeedData, 
        retryFeed,
        handleAddFeed, 
        handleEditFeed, 
        handleDeleteFeed,
        bookmarks,
        isLoaded,
        isBookmarked,
        allBookmarkActions: {
          addBookmark,
          removeBookmark,
          toggleBookmark,
          clearAllBookmarks
        },
        // For convenience in some components
        toggleBookmark,
        removeBookmark,
        clearAllBookmarks
      }} />

      <FeedFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => { setIsFormModalOpen(false); setEditingFeed(null); }}
        onSave={saveUserFeed}
        feed={editingFeed}
      />

      <ConfirmModal
        isOpen={!!deletingFeed}
        onClose={() => setDeletingFeed(null)}
        onConfirm={onConfirmDelete}
        title="Delete Feed"
        hideCloseButton={true}
        message={`Are you sure you want to delete "${deletingFeed?.name}"?`}
      />
    </div>
  );
};

export default RootLayout;
