import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import FeedPage from '@/pages/FeedPage';
import BookmarksPage from '@/pages/BookmarksPage';
import StoryPage from '@/pages/StoryPage';
import { DEFAULT_FEEDS } from '@/constants/feeds';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={`/feed/${DEFAULT_FEEDS[0].id}`} replace />,
      },
      {
        path: 'feed/:feedId',
        element: <FeedPage />,
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: 'read/:slug',
        element: <StoryPage />,
      },
    ],
  },
]);
