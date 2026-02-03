import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

import FeedSelector from '@/components/FeedSelector';
import StoryList from '@/components/StoryList';
import StoryDetail from '@/components/StoryDetail';
import BookmarkList from '@/components/BookmarkList';
import { useBookmarks } from '@/hooks/useBookmarks';
import { fetchAndParseRSS } from '@/utils/rssParser';

const FEED_SOURCES = [
  { id: 'backchannel', name: 'Backchannel', url: 'https://medium.com/feed/backchannel' },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/startups/feed/' },
  { id: 'economist', name: 'The Economist', url: 'https://medium.com/feed/the-economist' },
];

function App() {
  const [feedData, setFeedData] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [errors, setErrors] = useState({});
  
  const { 
    bookmarks, 
    isLoaded: bookmarksLoaded, 
    isBookmarked, 
    toggleBookmark, 
    removeBookmark,
    clearAllBookmarks 
  } = useBookmarks();

  const fetchFeed = useCallback(async (feedId) => {
    // Prevent fetching if we already have data, are loading, OR have a persistent error
    // To retry, the error must be cleared first (which handleRetryFeed does)
    if (feedData[feedId] || isLoading[feedId] || errors[feedId]) return;
    
    const feedSource = FEED_SOURCES.find(f => f.id === feedId);
    if (!feedSource) return;

    setIsLoading(prev => ({ ...prev, [feedId]: true }));
    // We don't clear error here because if we are here, errors[feedId] must be falsy
    
    try {
      const data = await fetchAndParseRSS(feedSource.url);
      setFeedData(prev => ({ ...prev, [feedId]: data }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
      setErrors(prev => ({ ...prev, [feedId]: errorMessage }));
    } finally {
      setIsLoading(prev => ({ ...prev, [feedId]: false }));
    }
  }, [feedData, isLoading, errors]);

  const handleRetryFeed = useCallback((feedId) => {
    setFeedData(prev => {
      const newState = { ...prev };
      delete newState[feedId];
      return newState;
    });
    setErrors(prev => ({ ...prev, [feedId]: '' }));
    // fetchFeed will be triggered by the effect in FeedRoute
  }, []);

  if (!bookmarksLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-[#F04E23] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your feeds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-gray-50/50">
      <Routes>
        <Route path="/" element={<Navigate to={`/feed/${FEED_SOURCES[0].id}`} replace />} />
        <Route path="/feed/:feedId" element={
          <FeedRoute 
            feeds={FEED_SOURCES} 
            feedData={feedData} 
            isLoading={isLoading} 
            errors={errors} 
            fetchFeed={fetchFeed} 
            bookmarks={bookmarks}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            onRetry={handleRetryFeed}
          />
        } />
        <Route path="/bookmarks" element={
          <BookmarksRoute 
            feeds={FEED_SOURCES} 
            bookmarks={bookmarks}
            removeBookmark={removeBookmark}
            clearAllBookmarks={clearAllBookmarks}
          />
        } />
        <Route path="/read/:slug" element={
          <StoryRoute 
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
          />
        } />
      </Routes>
    </div>
  );
}

const Header = ({ title = "FeedReader", showBookmarks = true, bookmarkCount = 0, currentPath = '' }) => {
  const navigate = useNavigate();
  return (
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FeedReader</h1>
              <p className="hidden sm:block text-xs text-gray-500 -mt-0.5">Stay informed</p>
            </div>
          </div>
          
          {showBookmarks && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/bookmarks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPath === '/bookmarks'
                    ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Bookmarks</span>
                {bookmarkCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    currentPath === '/bookmarks' ? 'bg-white/20' : 'bg-[#F04E23] text-white'
                  }`}>
                    {bookmarkCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>
  );
};

const FeedRoute = ({ feeds, feedData, isLoading, errors, fetchFeed, bookmarks, isBookmarked, toggleBookmark, onRetry }) => {
  const { feedId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (feedId) {
      fetchFeed(feedId);
    }
  }, [feedId, fetchFeed]);

  const currentFeed = feedData[feedId];
  const feedSource = feeds.find(f => f.id === feedId);
  const feedName = feedSource?.name || 'Unknown Feed';

  const handleSelectStory = (story) => {
    // Create a slug for the URL
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
              feeds={feeds}
              selectedFeedId={feedId}
              onSelectFeed={(id) => navigate(`/feed/${id}`)}
              onViewBookmarks={() => navigate('/bookmarks')}
              bookmarkCount={bookmarks.length}
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
              onRetry={() => onRetry(feedId)}
            />
          </section>
        </div>
      </main>
    </>
  );
};

const BookmarksRoute = ({ feeds, bookmarks, removeBookmark, clearAllBookmarks }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
              feeds={feeds}
              selectedFeedId="bookmarks"
              onSelectFeed={(id) => navigate(`/feed/${id}`)}
              onViewBookmarks={() => navigate('/bookmarks')}
              bookmarkCount={bookmarks.length}
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

const StoryRoute = ({ isBookmarked, toggleBookmark }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.story) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Story not found</h2>
        <p className="text-gray-500 mb-6">The story context was lost (likely due to a refresh).</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#F04E23] text-white rounded-xl font-medium hover:bg-[#D9441F] transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Header showBookmarks={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
         <div className="max-w-5xl mx-auto">
          <StoryDetail
            story={state.story}
            feedName={state.feedName}
            isBookmarked={isBookmarked(state.story.guid || '')}
            onToggleBookmark={() => toggleBookmark(state.story, state.feedId, state.feedName)}
            onBack={() => navigate(-1)}
          />
        </div>
      </main>
    </>
  );
};

export default App;
