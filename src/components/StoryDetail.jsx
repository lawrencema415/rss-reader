import { ArrowLeft, Bookmark, ExternalLink, Clock, User, Share2 } from 'lucide-react';
import { useState } from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

const StoryDetail = ({ 
  story, 
  feedName, 
  isBookmarked, 
  onToggleBookmark, 
  onBack 
}) => {
  const content = story.content || story.description || '';
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(story.link);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#F04E23] bg-gray-100 hover:bg-orange-50 px-4 py-2.5 rounded-xl transition-all duration-200 w-fit"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isBookmarked
                  ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#F04E23]'
              }`}
              onClick={onToggleBookmark}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
            
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 relative"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share
              {showCopied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            
            <a 
              href={story.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Original
            </a>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <article className="px-4 sm:px-8 py-6 sm:py-10 max-w-4xl mx-auto">
        {/* Feed Tag */}
        <div className="mb-4">
          <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#F04E23] bg-orange-50 px-3 py-1.5 rounded-lg">
            {feedName}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
          {story.title}
        </h1>
        
        {/* Author & Date */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          {story.author && (
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">{story.author}</span>
            </span>
          )}
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatDate(story.pubDate)}
          </span>
        </div>
        
        {/* Body */}
        <div 
          className="story-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}

export default StoryDetail;