import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ModuleProgress, ProgressState } from './types';

const STORAGE_KEY = 'kids-app:progress:v1';

interface ProgressContextValue {
  isLoaded: boolean;
  progress: ProgressState;
  getModuleProgress: (moduleId: string) => ModuleProgress;
  addStars: (moduleId: string, stars: number) => void;
  registerSession: (moduleId: string) => void;
  resetProgress: () => void;
}

const defaultModuleProgress: ModuleProgress = { stars: 0, timesPlayed: 0 };

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            setProgress(JSON.parse(raw) as ProgressState);
          } catch {
            setProgress({});
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setProgress(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // Progress is best-effort; losing it isn't fatal for a kids game.
    });
  }, []);

  const getModuleProgress = useCallback(
    (moduleId: string) => progress[moduleId] ?? defaultModuleProgress,
    [progress]
  );

  const addStars = useCallback(
    (moduleId: string, stars: number) => {
      const current = progress[moduleId] ?? defaultModuleProgress;
      persist({
        ...progress,
        [moduleId]: { ...current, stars: current.stars + stars },
      });
    },
    [progress, persist]
  );

  const registerSession = useCallback(
    (moduleId: string) => {
      const current = progress[moduleId] ?? defaultModuleProgress;
      persist({
        ...progress,
        [moduleId]: { ...current, timesPlayed: current.timesPlayed + 1 },
      });
    },
    [progress, persist]
  );

  const resetProgress = useCallback(() => {
    persist({});
  }, [persist]);

  const value = useMemo(
    () => ({ isLoaded, progress, getModuleProgress, addStars, registerSession, resetProgress }),
    [isLoaded, progress, getModuleProgress, addStars, registerSession, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
