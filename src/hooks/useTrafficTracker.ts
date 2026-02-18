import { useState } from 'react';

// Define the shape of our data
export interface TrafficData {
  source: string;
  medium: string;
  campaign: string;
  landed_at: string;
}

const STORAGE_KEY = 'dental_store_traffic';

export const useTrafficTracker = () => {
  // THE FIX: We pass a function to useState. 
  // This runs ONCE immediately when the app starts, not after.
  const [trafficData, setTrafficData] = useState<TrafficData | null>(() => {
    
    // 1. Check if we are in a browser environment (safety check)
    if (typeof window === 'undefined') return null;

    // 2. Try to read from URL first (High Priority)
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get('utm_source');

    if (urlSource) {
      // New visitor! Capture them.
      const newData: TrafficData = {
        source: urlSource,
        medium: params.get('utm_medium') || 'unknown',
        campaign: params.get('utm_campaign') || 'unknown',
        landed_at: new Date().toISOString(),
      };

      // Save to Browser Storage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      console.log('🎯 Tracker: Captured new campaign data:', newData);
      return newData; // This becomes the initial state
    }

    // 3. No URL? Check LocalStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('👀 Tracker: Found existing user data:', parsed);
        return parsed;
      } catch {
        return null;
      }
    }

    return null;
  });

  const clearTrackingData = () => {
    // 1. Clear the storage
    localStorage.removeItem(STORAGE_KEY);
    setTrafficData(null);

    // 2. NEW: Clean the URL bar so a refresh doesn't re-trigger it
    // This removes the "?utm_source=..." without reloading the page
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
  };

  return { trafficData, clearTrackingData };
};