import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { Rss, BookOpen } from 'lucide-react';

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
  const [selectedFeedId, setSelectedFeedId] = useState(FEED_SOURCES[0].id);
  const [feedData, setFeedData] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [viewState, setViewState] = useState(/** @type {{ type: string, story?: any, feedName?: string }} */ ({ type: 'list' }));
  
  const { 
    bookmarks, 
    isLoaded: bookmarksLoaded, 
    isBookmarked, 
    toggleBookmark, 
    removeBookmark,
    clearAllBookmarks 
  } = useBookmarks();

  useEffect(() => {
    const fetchFeed = async (feedId) => {
      // Don't fetch if we already have data, are currently loading, or have an error
      if (feedData[feedId] || isLoading[feedId] || errors[feedId]) return;
      
      const feedSource = FEED_SOURCES.find(f => f.id === feedId);
      if (!feedSource) return;

      setIsLoading(prev => ({ ...prev, [feedId]: true }));
      setErrors(prev => ({ ...prev, [feedId]: '' }));

      try {
        const data = await fetchAndParseRSS(feedSource.url);
        setFeedData(prev => ({ ...prev, [feedId]: data }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
        setErrors(prev => ({ ...prev, [feedId]: errorMessage }));
      } finally {
        setIsLoading(prev => ({ ...prev, [feedId]: false }));
      }
    };

    if (selectedFeedId !== 'bookmarks') {
      fetchFeed(selectedFeedId);
    }
    // Only re-run when selectedFeedId changes
  }, [selectedFeedId, feedData, isLoading, errors]);

  const handleSelectFeed = useCallback((feedId) => {
    setSelectedFeedId(feedId);
    setViewState({ type: 'list' });
  }, []);

  const handleViewBookmarks = useCallback(() => {
    setSelectedFeedId('bookmarks');
    setViewState({ type: 'bookmarks' });
  }, []);

  const handleSelectStory = useCallback((story) => {
    const feedName = selectedFeedId === 'bookmarks' 
      ? story.feedName 
      : FEED_SOURCES.find(f => f.id === selectedFeedId)?.name || 'Unknown';
    setViewState({ type: 'detail', story, feedName });
  }, [selectedFeedId]);

  const handleBack = useCallback(() => {
    if (selectedFeedId === 'bookmarks') {
      setViewState({ type: 'bookmarks' });
    } else {
      setViewState({ type: 'list' });
    }
  }, [selectedFeedId]);

  const handleToggleBookmark = useCallback((story) => {
    const feedName = selectedFeedId === 'bookmarks' 
      ? story.feedName 
      : FEED_SOURCES.find(f => f.id === selectedFeedId)?.name || 'Unknown';
    toggleBookmark(story, selectedFeedId === 'bookmarks' ? story.feedId : selectedFeedId, feedName);
  }, [selectedFeedId, toggleBookmark]);

  const handleRetryFeed = useCallback((feedId) => {
    // Clear the error and refetch
    setErrors(prev => ({ ...prev, [feedId]: '' }));
    
    const feedSource = FEED_SOURCES.find(f => f.id === feedId);
    if (!feedSource) return;

    setIsLoading(prev => ({ ...prev, [feedId]: true }));

    fetchAndParseRSS(feedSource.url)
      .then(data => {
        setFeedData(prev => ({ ...prev, [feedId]: data }));
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
        setErrors(prev => ({ ...prev, [feedId]: errorMessage }));
      })
      .finally(() => {
        setIsLoading(prev => ({ ...prev, [feedId]: false }));
      });
  }, []);

  const currentFeed = feedData[selectedFeedId];
  const currentFeedName = FEED_SOURCES.find(f => f.id === selectedFeedId)?.name || 'Bookmarks';

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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">FeedReader</h1>
              <p className="hidden sm:block text-xs text-gray-500 -mt-0.5">Stay informed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleViewBookmarks}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFeedId === 'bookmarks'
                  ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedFeedId === 'bookmarks' ? 'bg-white/20' : 'bg-[#F04E23] text-white'
                }`}>
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {viewState.type === 'detail' ? (
        <div className="max-w-5xl mx-auto">
          <StoryDetail
            story={viewState.story}
            feedName={viewState.feedName}
            isBookmarked={isBookmarked(viewState.story.guid || '')}
            onToggleBookmark={() => handleToggleBookmark(viewState.story)}
            onBack={handleBack}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <FeedSelector
              feeds={FEED_SOURCES}
              selectedFeedId={selectedFeedId}
              onSelectFeed={handleSelectFeed}
              onViewBookmarks={handleViewBookmarks}
              bookmarkCount={bookmarks.length}
            />
          </aside>

          {/* Content Area */}
          <section className="flex-1 min-w-0">
            {viewState.type === 'list' && (
              <StoryList
                stories={currentFeed?.items || []}
                feedName={currentFeedName}
                onSelectStory={handleSelectStory}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                isLoading={isLoading[selectedFeedId]}
                error={errors[selectedFeedId]}
                onRetry={() => handleRetryFeed(selectedFeedId)}
              />
            )}

            {viewState.type === 'bookmarks' && (
              <BookmarkList
                bookmarks={bookmarks}
                onSelectStory={handleSelectStory}
                onRemoveBookmark={removeBookmark}
                onClearAll={clearAllBookmarks}
              />
            )}
          </section>
        </div>
      )}
      </main>
    </div>
  );
}

export default App;
