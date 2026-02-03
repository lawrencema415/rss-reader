import { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  RefreshCw, 
  Bookmark, 
  BookmarkPlus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * @typedef {import('@/types/rss').RSSItem} RSSItem
 */

const ITEMS_PER_PAGE = 6;

/**
 * @param {Object} props
 * @param {RSSItem[]} props.stories
 * @param {string} props.feedName
 * @param {function(RSSItem): void} props.onSelectStory
 * @param {function(string): boolean} props.isBookmarked
 * @param {function(RSSItem): void} props.onToggleBookmark
 * @param {boolean} [props.isLoading]
 * @param {string|null} [props.error]
 * @param {function(): void} [props.onRetry]
 */
const StoryList = ({ 
  stories, 
  feedName, 
  onSelectStory, 
  isBookmarked, 
  onToggleBookmark,
  isLoading,
  error,
  onRetry
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when feed changes
  useEffect(() => {
    setCurrentPage(1);
  }, [stories.length, feedName]);

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return dateString;
    }
  }

  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 min-h-[500px]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{feedName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Loading latest stories...</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <Loader2 className="w-10 h-10 text-[#F04E23] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Fetching stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 min-h-[500px]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{feedName}</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium mb-2">Unable to load feed</p>
          <p className="text-gray-500 text-sm max-w-md mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 bg-[#F04E23] text-white rounded-xl font-medium hover:bg-[#D9441F] transition-all duration-200 shadow-lg shadow-orange-200 hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 min-h-[500px]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{feedName}</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium mb-1">No stories found</p>
          <p className="text-gray-500 text-sm">This feed appears to be empty</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(stories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStories = stories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // How many numbers to show before starting to use ellipsis

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Show neighbors and everything between 1 and currentPage
      const start = 2;
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white leading-tight">
        <div>
          <h2 className="text-lg font-bold text-[#F04E23]">{feedName}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{stories.length} stories</p>
        </div>
      </div>

      {/* Stories */}
      <div className="divide-y divide-gray-50 flex-1">
        {currentStories.map((story, index) => {
          const bookmarked = isBookmarked(story.guid || '');
          return (
            <article 
              key={story.guid || index} 
              className="group p-4 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectStory(story)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {story.thumbnail && (
                  <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img 
                      src={story.thumbnail} 
                      alt="thumbnail image"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-snug group-hover:text-[#F04E23] transition-colors line-clamp-1">
                    {story.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-2 line-clamp-1">
                    {truncateText(story.description, 150)}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    {story.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        {story.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(story.pubDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      bookmarked 
                        ? 'text-[#F04E23] bg-orange-100' 
                        : 'text-gray-400 hover:text-[#F04E23] hover:bg-orange-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(story);
                    }}
                    title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {bookmarked ? (
                      <BookmarkPlus className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  
                  <a
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open external link"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-[#F04E23] hover:text-white transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Open external link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page <span className="font-semibold text-gray-600">{currentPage}</span> of <span className="font-semibold text-gray-600">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers - visible only on tablet and up */}
            <div className="hidden md:flex items-center gap-1 mx-1">
              {getPageNumbers().map((page, i) => {
                if (page === '...') {
                  return <span key={`ellipsis-${i}`} className="text-[10px] text-gray-400 px-0.5">...</span>;
                }
                return (
                  <button
                    key={page}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all ${
                      currentPage === page
                        ? 'bg-[#F04E23] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryList;
