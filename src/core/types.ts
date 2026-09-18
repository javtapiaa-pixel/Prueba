import type { ComponentType } from 'react';

/**
 * Contract every learning module must satisfy to be plugged into the app.
 * Adding a new module later only requires creating a folder under
 * src/modules and registering one of these in src/core/moduleRegistry.ts.
 */
export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  /** Top-level screen rendered when the module is opened from Home. */
  Component: ComponentType;
  /** Number of stars that count as "mastered" for this module, used for progress bars. */
  starsGoal: number;
}

export interface ModuleProgress {
  stars: number;
  timesPlayed: number;
}

export type ProgressState = Record<string, ModuleProgress>;
