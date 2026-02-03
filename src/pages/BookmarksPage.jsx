import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import Header from '@/components/Header';
import FeedSelector from '@/components/FeedSelector';
import BookmarkList from '@/components/BookmarkList';
import { useAuth } from '@/context/AuthContext';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  /** @type {import('@/types/rss').LayoutContext} */
  const { 
    allFeeds, 
    bookmarks, 
    removeBookmark, 
    clearAllBookmarks,
    handleAddFeed, 
    handleEditFeed, 
    handleDeleteFeed 
  } = useOutletContext();

  const handleSelectStory = (story) => {
    const slug = encodeURIComponent(story.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    navigate(`/read/${slug}`, { state: { story, feedName: story.feedName, feedId: story.feedId } });
  };

  return (
    <>
      <Header bookmarkCount={bookmarks.length} currentPath={location.pathname} />
       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 shrink-0">
            <FeedSelector
              feeds={allFeeds}
              selectedFeedId="bookmarks"
              onSelectFeed={(id) => navigate(`/feed/${id}`)}
              onViewBookmarks={() => navigate('/bookmarks')}
              bookmarkCount={bookmarks.length}
              onAddFeed={handleAddFeed}
              onEditFeed={handleEditFeed}
              onDeleteFeed={handleDeleteFeed}
              user={user}
            />
          </aside>
          <section className="flex-1 min-w-0">
             <BookmarkList
                bookmarks={bookmarks}
                onSelectStory={handleSelectStory}
                onRemoveBookmark={removeBookmark}
                onClearAll={clearAllBookmarks}
              />
          </section>
        </div>
      </main>
    </>
  );
};

export default BookmarksPage;
