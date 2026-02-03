import { Rss, Newspaper, Plus, Settings2, Trash2 } from 'lucide-react';

const FeedSelector = ({ 
  feeds, 
  selectedFeedId, 
  onSelectFeed, 
  onAddFeed,
  onEditFeed,
  onDeleteFeed,
  user
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden sticky top-22">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          Your Feeds
        </h2>
        {user && (
          <button 
            onClick={onAddFeed}
            className="p-1.5 hover:bg-orange-100 rounded-lg text-[#F04E23] transition-colors tooltip"
            title="Add new feed"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="p-2 space-y-1">
        {/* Feed Options */}
        {feeds.map((feed) => (
          <div key={feed.id} className="relative group/item">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                selectedFeedId === feed.id.toString() || selectedFeedId === feed.id
                  ? 'bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white shadow-lg shadow-orange-200'
                  : 'hover:bg-orange-50 text-gray-700'
              }`}
              onClick={() => onSelectFeed(feed.id)}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                selectedFeedId === feed.id.toString() || selectedFeedId === feed.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-orange-100'
              }`}>
                <Rss className={`w-4 h-4 ${selectedFeedId === feed.id.toString() || selectedFeedId === feed.id ? 'text-white' : 'text-gray-500 group-hover:text-[#F04E23]'}`} />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <span className="font-medium text-sm block truncate">{feed.name}</span>
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
  );
}

export default FeedSelector;
