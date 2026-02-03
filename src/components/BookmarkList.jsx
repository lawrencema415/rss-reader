import { Clock, User, Trash2, Inbox, ExternalLink, Bookmark } from 'lucide-react';
import { useState } from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}

const BookmarkList = ({ 
  bookmarks, 
  onSelectStory, 
  onRemoveBookmark,
  onClearAll 
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 min-h-[500px]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-[#F04E23]" />
            <h2 className="text-xl font-bold text-gray-900">Bookmarks</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
            <Inbox className="w-10 h-10 text-[#F04E23]" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-2">No bookmarks yet</p>
          <p className="text-gray-500 text-sm max-w-sm">
            Click the bookmark icon on any story to save it here for later reading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-3">
          <Bookmark className="w-5 h-5 text-[#F04E23]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bookmarks</h2>
            <p className="text-sm text-gray-500">{bookmarks.length} saved stories</p>
          </div>
        </div>
        
        {showConfirmClear ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-sm text-gray-600 select-none">Clear all?</span>
            <button 
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={() => setShowConfirmClear(false)}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              onClick={() => {
                onClearAll();
                setShowConfirmClear(false);
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            onClick={() => setShowConfirmClear(true)}
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Bookmarks */}
      <div className="divide-y divide-gray-50">
        {bookmarks.map((story, index) => (
          <article 
            key={story.guid || index} 
            className="group p-5 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {story.thumbnail && (
                <div 
                  className="shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
                  onClick={() => onSelectStory(story)}
                >
                  <img 
                    src={story.thumbnail} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div 
                className="flex-1 min-w-0"
                onClick={() => onSelectStory(story)}
              >
                {/* Source & Saved Date */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#F04E23] bg-orange-50 px-2.5 py-1 rounded-lg">
                    {story.feedName}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Saved {formatDate(story.bookmarkedAt)}
                  </span>
                </div>
                
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-[#F04E23] bg-orange-100 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(story.guid || '');
                  }}
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-[#F04E23] hover:text-white transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BookmarkList;
