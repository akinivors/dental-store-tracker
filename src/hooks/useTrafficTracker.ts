import { useState } from 'react';

const STORAGE_KEY = 'user_traffic_source';

export interface TrafficData {
  source: string;
  medium: string;
  campaign: string;
}

export const useTrafficTracker = () => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(() => {
    // SAFETY CHECK 1: Try-Catch for all localStorage operations
    try {
      // Check URL first for new tracking data
      const query = new URLSearchParams(window.location.search);
      const source = query.get('utm_source');

      if (source) {
        // New tracking data from URL
        const newData = {
          source: source,
          medium: query.get('utm_medium') || 'none',
          campaign: query.get('utm_campaign') || 'none',
        };

        // SAFETY CHECK 2: Try-Catch writing to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (writeError) {
          console.error('Could not save tracking data:', writeError);
        }
        
        return newData;
      }

      // No URL params? Check localStorage for saved data
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      // Catch URL parsing errors or localStorage read failures
      console.warn('Tracking initialization failed:', error);
      return null; // Fail gracefully, don't crash
    }
  });

  const clearTrackingData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage errors when clearing
    }
    setTrafficData(null);
  };

  return { trafficData, clearTrackingData };
};