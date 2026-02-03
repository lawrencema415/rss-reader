import { Clock, User, ArrowRight, Loader2, AlertCircle, Inbox, RefreshCw, Bookmark, BookmarkPlus } from 'lucide-react';

/**
 * @typedef {import('@/types/rss').RSSItem} RSSItem
 */

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{feedName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{stories.length} stories</p>
        </div>
      </div>

      {/* Stories */}
      <div className="divide-y divide-gray-50">
        {stories.map((story, index) => {
          const bookmarked = isBookmarked(story.guid || '');
          return (
            <article 
              key={story.guid || index} 
              className="group p-5 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectStory(story)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {story.thumbnail && (
                  <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img 
                      src={story.thumbnail} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#F04E23] transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                    {truncateText(story.description, 180)}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {story.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {story.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(story.pubDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      bookmarked 
                        ? 'text-[#F04E23] bg-orange-100' 
                        : 'text-gray-400 hover:text-[#F04E23] hover:bg-orange-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(story);
                    }}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {bookmarked ? (
                      <BookmarkPlus className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 group-hover:bg-[#F04E23] group-hover:text-white transition-all duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default StoryList;
