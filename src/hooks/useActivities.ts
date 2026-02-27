import { useState, useEffect, useCallback } from "react";
import { Activity } from "../types";

const STORAGE_KEY = "chromabase_activities";

export function useActivities(clientId?: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && clientId) {
      const allActs: Activity[] = JSON.parse(stored);
      const filtered = allActs
        .filter(a => a.client_id === clientId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setActivities(filtered);
    }
    setLoading(false);
  }, [clientId]);

  const addActivity = useCallback(async (activity: Omit<Activity, "id" | "created_at">) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    // Store in localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const allActs: Activity[] = stored ? JSON.parse(stored) : [];
    allActs.push(newActivity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allActs));
    setActivities(prev => [newActivity, ...prev]);
    
    return newActivity;
  }, []);

  return { activities, loading, addActivity };
}
