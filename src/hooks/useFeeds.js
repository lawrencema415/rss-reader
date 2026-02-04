import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_FEEDS } from '@/constants/feeds';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { fetchAndParseRSS } from '@/utils/rssParser';


export function useFeeds() {
  const { user } = useAuth();
  const [userFeeds, setUserFeeds] = useState([]);
  const [feedData, setFeedData] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Combined feeds
  const allFeeds = [
    ...DEFAULT_FEEDS, 
    ...userFeeds.map(f => ({ ...f, isUserFeed: true }))
  ];

  const fetchUserFeeds = useCallback(async () => {
    if (!user) {
      setUserFeeds([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_feeds')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUserFeeds(data || []);
    } catch (error) {
      console.error('Error fetching user feeds:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserFeeds();
  }, [fetchUserFeeds]);

  const saveUserFeed = async ({ name, url, id }) => {
    if (!user) return;

    // Check if URL already exists in either DEFAULT_FEEDS or userFeeds
    // If editing (id exists), skip the check for the current feed's own URL
    const normalizedUrl = url.trim().toLowerCase();
    const isDuplicate = allFeeds.some(f => 
      f.url.trim().toLowerCase() === normalizedUrl && 
      (!id || f.id.toString() !== id.toString())
    );

    if (isDuplicate) {
      throw new Error('DUPLICATE_URL');
    }

    if (id) {
      try {
        console.log('Attempting to update feed:', { id, name, url });
        const { error } = await supabase
          .from('user_feeds')
          .update({ name, url })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        // Update local state immediately on success
        setUserFeeds(prev => {
          const updated = prev.map(f => (f.id == id) ? { ...f, name, url } : f);
          console.log('State updated. Before:', prev.length, 'After updated match:', updated.some(f => f.id == id));
          return updated;
        });
        
        // Clear cached data for this feed so it reloads with new URL/name
        setFeedData(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            if (key == id) delete newState[key];
          });
          return newState;
        });
        
        console.log('Feed update successful');
      } catch (error) {
        console.error('Error in saveUserFeed (update):', error);
        throw error;
      }
    } else {
      try {
        const { data, error } = await supabase
          .from('user_feeds')
          .insert([{ user_id: user.id, name, url }])
          .select();

        if (error) throw error;
        setUserFeeds(prev => [...prev, ...(data || [])]);
      } catch (error) {
        console.error('Error adding feed:', error);
        throw error;
      }
    }
  };

  const deleteUserFeed = async (feedId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_feeds')
        .delete()
        .eq('id', feedId);

      if (error) throw error;
      
      setUserFeeds(prev => prev.filter(f => f.id != feedId));
      setFeedData(prev => {
        const newState = { ...prev };
        const keyToClear = Object.keys(newState).find(k => k == feedId);
        if (keyToClear) delete newState[keyToClear];
        return newState;
      });
    } catch (error) {
      console.error('Error deleting feed:', error);
      throw error;
    }
  };

  const fetchFeedData = useCallback(async (feedId) => {
    if (feedData[feedId] || isLoading[feedId] || errors[feedId]) return;
    
    const feedSource = allFeeds.find(f => f.id === feedId || f.id?.toString() === feedId);
    if (!feedSource) return;

    setIsLoading(prev => ({ ...prev, [feedId]: true }));
    
    try {
      const data = await fetchAndParseRSS(feedSource.url);
      setFeedData(prev => ({ ...prev, [feedId]: data }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
      setErrors(prev => ({ ...prev, [feedId]: errorMessage }));
    } finally {
      setIsLoading(prev => ({ ...prev, [feedId]: false }));
    }
  }, [allFeeds, feedData, isLoading, errors]);

  const retryFeed = useCallback((feedId) => {
    setFeedData(prev => {
      const newState = { ...prev };
      delete newState[feedId];
      return newState;
    });
    setErrors(prev => ({ ...prev, [feedId]: '' }));
  }, []);

  return {
    allFeeds,
    deleteUserFeed,
    errors,
    feedData,
    fetchFeedData,
    isLoading,
    retryFeed,
    saveUserFeed
  };

}
