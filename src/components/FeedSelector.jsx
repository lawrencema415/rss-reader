import { useState } from 'react';
import { Rss, Newspaper, Plus, Settings2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const FeedSelector = ({ 
  feeds, 
  selectedFeedId, 
  onSelectFeed, 
  onAddFeed,
  onEditFeed,
  onDeleteFeed,
  user
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current feed name for collapsed title
  const currentFeed = feeds.find(f => f.id.toString() === selectedFeedId?.toString());

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 sticky lg:top-22 z-30 max-h-[815px] flex flex-col overflow-hidden transition-all duration-300">
      {/* Header / Toggle Button */}
      <div 
        className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between shrink-0 cursor-pointer lg:cursor-default group/header"
        onClick={() => {
          // Only allow toggling if we're not on desktop
          if (window.innerWidth < 1024) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] flex items-center gap-2 group-hover/header:text-[#F04E23] lg:group-hover/header:text-gray-400 transition-colors">
            <Newspaper className="w-3.5 h-3.5" />
            Your Feeds
          </h2>
        </div>
        
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {user && (
            <button 
              onClick={onAddFeed}
              className="p-1.5 hover:bg-orange-100 rounded-lg text-[#F04E23] transition-colors"
              title="Add new feed"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {/* Chevron - only visible on small/medium screens */}
          <button 
            className="lg:hidden p-1 text-gray-400 hover:text-[#F04E23] transition-colors focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? "Collapse feeds" : "Expand feeds"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out custom-scrollbar ${
        isExpanded 
          ? 'max-h-[80vh] sm:max-h-[60vh] lg:max-h-none opacity-100 overflow-y-auto py-3' 
          : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 overflow-hidden lg:overflow-y-auto lg:py-3'
      }`}>
        <div className="px-2 space-y-1">
          {/* Feed Options */}
          {feeds.map((feed) => (
            <div key={feed.id} className="relative group/item">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 ${
                  selectedFeedId === feed.id.toString() || selectedFeedId === feed.id
                    ? 'bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white shadow-lg shadow-orange-200'
                    : 'hover:bg-orange-50 text-gray-700'
                }`}
                onClick={() => {
                  onSelectFeed(feed.id);
                  setIsExpanded(false); // Auto-collapse on selection for better mobile UX
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  selectedFeedId === feed.id.toString() || selectedFeedId === feed.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-orange-100'
                }`}>
                  <Rss className={`w-3.5 h-3.5 ${selectedFeedId === feed.id.toString() || selectedFeedId === feed.id ? 'text-white' : 'text-gray-500 group-hover:text-[#F04E23]'}`} />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <span className="font-semibold text-sm block truncate">{feed.name}</span>
                </div>
              </button>

              {feed.isUserFeed && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditFeed(feed);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      selectedFeedId === feed.id.toString() || selectedFeedId === feed.id
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-orange-100 text-gray-400 hover:text-gray-600'
                    }`}
                    title="Edit feed"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFeed(feed);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      selectedFeedId === feed.id.toString() || selectedFeedId === feed.id
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                    }`}
                    title="Delete feed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedSelector;
