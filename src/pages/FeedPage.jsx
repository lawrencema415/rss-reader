import { useEffect } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import Header from '@/components/Header';
import FeedSelector from '@/components/FeedSelector';
import StoryList from '@/components/StoryList';
import { useAuth } from '@/context/AuthContext';

const FeedPage = () => {
  const { feedId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get data and handle modal handlers from RootLayout via useOutletContext
  /** @type {import('@/types/rss').LayoutContext} */
  const { 
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
    isBookmarked,
    toggleBookmark
  } = useOutletContext();

  useEffect(() => {
    if (feedId) {
      fetchFeedData(feedId);
    }
  }, [feedId, fetchFeedData]);

  const currentFeed = feedData[feedId];
  const feedSource = allFeeds.find(f => f.id === feedId || f.id?.toString() === feedId);
  const feedName = feedSource?.name || 'Unknown Feed';

  const handleSelectStory = (story) => {
    const slug = encodeURIComponent(story.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    navigate(`/read/${slug}`, { state: { story, feedName, feedId } });
  };

  return (
    <>
      <Header bookmarkCount={bookmarks.length} currentPath={location.pathname} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 shrink-0">
            <FeedSelector
              feeds={allFeeds}
              selectedFeedId={feedId}
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
            <StoryList
              stories={currentFeed?.items || []}
              feedName={feedName}
              onSelectStory={handleSelectStory}
              isBookmarked={isBookmarked}
              onToggleBookmark={(story) => toggleBookmark(story, feedId, feedName)}
              isLoading={isLoading[feedId]}
              error={errors[feedId]}
              onRetry={() => retryFeed(feedId)}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default FeedPage;
