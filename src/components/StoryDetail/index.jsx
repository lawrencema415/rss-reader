import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bookmark, Clock, ExternalLink, Facebook, Mail, Share2, Twitter, User } from 'lucide-react';

import { formatFullDate } from '../../utils/formatters';

const StoryDetail = ({ 
  feedName, 
  isBookmarked, 
  onBack, 
  onToggleBookmark, 
  story 
}) => {

  const content = story.content || story.description || '';
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);

  // Auto-hide logic
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (!isHovering) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 1500);
      }
    };

    const handleMouseMove = (e) => {
      // Show if moving mouse UP (movementY is negative)
      // Or if mouse is near the top of the browser (within 100px)
      if (e.movementY < 0 || e.clientY < 100) {
        setIsVisible(true);
        resetTimer();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    resetTimer(); // Start initial timer

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovering]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 animate-fade-in relative">
      {/* Header */}
      <div 
        className={`sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => {
          setIsHovering(true);
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#F04E23] bg-gray-100 hover:bg-orange-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200"
            onClick={onBack}
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isBookmarked
                  ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#F04E23]'
              }`}
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            
            <a 
              href={story.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#F04E23] to-[#D9441F] text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
              title="View original article"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Original</span>
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
            {formatFullDate(story.pubDate)}
          </span>
        </div>
        
        {/* Body */}
        <div 
          className="story-body mb-12"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Social Sharing Section */}
        <div className="pt-8 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#F04E23]" />
            Share this story
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(story.link)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-95"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(story.link)}&text=${encodeURIComponent(story.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-sky-200 transition-all duration-200 active:scale-95"
            >
              <Twitter className="w-4 h-4" />
              Tweet
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(story.title)}&body=${encodeURIComponent(story.link)}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-gray-200 transition-all duration-200 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

export default StoryDetail;
