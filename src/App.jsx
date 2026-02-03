import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#F04E23]" />
      </div>
    );
  }

  return (
    <RouterProvider router={router} key={user?.id || 'guest'} />
  );
}

export default App;
