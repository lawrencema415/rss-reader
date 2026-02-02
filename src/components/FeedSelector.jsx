import { Rss, Bookmark, Newspaper } from 'lucide-react';

const FeedSelector = ({ 
  feeds, 
  selectedFeedId, 
  onSelectFeed, 
  onViewBookmarks,
  bookmarkCount 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden sticky top-22">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          Your Feeds
        </h2>
      </div>
      
      <div className="p-2 space-y-1">
        {/* Bookmarks Option */}
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            selectedFeedId === 'bookmarks'
              ? 'bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white shadow-lg shadow-orange-200'
              : 'hover:bg-orange-50 text-gray-700'
          }`}
          onClick={onViewBookmarks}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            selectedFeedId === 'bookmarks' ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'
          }`}>
            <Bookmark className={`w-4 h-4 ${selectedFeedId === 'bookmarks' ? 'text-white' : 'text-[#F04E23]'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm">Bookmarks</span>
            <p className="text-xs opacity-70 truncate">
              {bookmarkCount > 0 ? `${bookmarkCount} saved` : 'No bookmarks'}
            </p>
          </div>
        </button>

        <div className="h-px bg-gray-100 my-2" />

        {/* Feed Options */}
        {feeds.map((feed) => (
          <button
            key={feed.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              selectedFeedId === feed.id
                ? 'bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white shadow-lg shadow-orange-200'
                : 'hover:bg-orange-50 text-gray-700'
            }`}
            onClick={() => onSelectFeed(feed.id)}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              selectedFeedId === feed.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-orange-100'
            }`}>
              <Rss className={`w-4 h-4 ${selectedFeedId === feed.id ? 'text-white' : 'text-gray-500 group-hover:text-[#F04E23]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm block truncate">{feed.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FeedSelector;
