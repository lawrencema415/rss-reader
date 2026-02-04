import { useEffect, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Clock, ExternalLink, Inbox, Trash2, User } from 'lucide-react';

import ConfirmModal from './ConfirmModal';
import { formatRelativeDate, formatSimpleDate, getPageNumbers, truncateText } from '../utils/formatters';

const ITEMS_PER_PAGE = 5;

const BookmarkList = ({ 
  bookmarks, 
  onClearAll,
  onRemoveBookmark,
  onSelectStory
}) => {

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when bookmarks change significantly (e.g. filtered or cleared)
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(bookmarks.length / ITEMS_PER_PAGE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [bookmarks.length, currentPage]);

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
          <p className="text-gray-500 text-sm max-sm">
            Click the bookmark icon on any story to save it here for later reading
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(bookmarks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBookmarks = bookmarks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pageNumbers = getPageNumbers(currentPage, totalPages);


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white leading-tight">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bookmarks</h2>
            <p className="text-xs text-gray-500">{bookmarks.length} saved stories</p>
          </div>
        </div>
        
        <button 
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          hideCloseButton={true}
          onConfirm={() => {
            onClearAll();
            setIsConfirmModalOpen(false);
          }}
          title="Clear All Bookmarks"
          message="Are you sure you want to clear all your saved bookmarks?."
          confirmText="Clear All"
          isDestructive={true}
        />
      </div>

      {/* Bookmarks */}
      <div className="divide-y divide-gray-50 flex-1">
        {currentBookmarks.map((story, index) => (
          <article 
            key={story.guid || index} 
            className="group p-4 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {story.thumbnail && (
                <div 
                  className="shrink-0 w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
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
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-[#F04E23] bg-orange-50 px-2 py-0.5 rounded-md">
                    {story.feedName}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Saved {formatSimpleDate(story.bookmarkedAt)}
                  </span>
                </div>
                
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
                    {formatRelativeDate(story.pubDate)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#F04E23] bg-orange-100 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(story.guid || '');
                  }}
                  title="Remove bookmark"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                
                <a
                  href={story.link}
                  target="_blank"
                  title="Open external link"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-[#F04E23] hover:text-white transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Open external link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
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
              {pageNumbers.map((page, i) => {
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

export default BookmarkList;
