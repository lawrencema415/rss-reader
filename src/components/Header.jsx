import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = ({ showBookmarks = true, bookmarkCount = 0, currentPath = '' }) => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RSS Reader</h1>
            <p className="hidden sm:block text-xs text-gray-500 -mt-0.5">Stay informed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {showBookmarks && (
            <>
            <button 
              onClick={() => navigate('/bookmarks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentPath === '/bookmarks'
                  ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  currentPath === '/bookmarks' ? 'bg-white/20' : 'bg-[#F04E23] text-white'
                }`}>
                  {bookmarkCount}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
            </>
          )}


          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="" 
                    className="w-7 h-7 rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-7 h-7 bg-[#F04E23] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-fade-in origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
