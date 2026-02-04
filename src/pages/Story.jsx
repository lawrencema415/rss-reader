import { useLocation, useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import StoryDetail from '@/components/StoryDetail';

const Story = ({ 
  isBookmarked, 
  toggleBookmark 
}) => {

  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.story) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Story not found</h2>
        <p className="text-gray-500 mb-6">The story context was lost (likely due to a refresh context).</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#F04E23] text-white rounded-xl font-medium hover:bg-[#D9441F] transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Header showBookmarks={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
         <div className="max-w-5xl mx-auto">
          <StoryDetail
            story={state.story}
            feedName={state.feedName}
            isBookmarked={isBookmarked(state.story.guid || '')}
            onToggleBookmark={() => toggleBookmark(state.story, state.feedId, state.feedName)}
            onBack={() => navigate(-1)}
          />
        </div>
      </main>
    </>
  );
};

export default Story;
