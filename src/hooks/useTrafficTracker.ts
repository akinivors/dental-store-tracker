import { useState } from 'react';

const STORAGE_KEY = 'user_traffic_source';

export interface TrafficData {
  source: string;
  medium: string;
  campaign: string;
}

export const useTrafficTracker = () => {
  // 1. FIX: Initialize State by checking BOTH LocalStorage AND URL
  // Priority: URL params override saved data (for new campaigns)
  const [trafficData, setTrafficData] = useState<TrafficData | null>(() => {
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

      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    }

    // No URL params? Check localStorage for saved data
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const clearTrackingData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTrafficData(null);
    
    // Optional: Clean URL for visual cleanliness
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
  };

  return { trafficData, clearTrackingData };
};