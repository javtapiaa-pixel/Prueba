import ArithmeticScreen from '../modules/arithmetic/ArithmeticScreen';
import LettersScreen from '../modules/letters/LettersScreen';
import ReadingScreen from '../modules/reading/ReadingScreen';
import { colors } from '../theme/theme';
import type { LearningModule } from './types';

/**
 * Single source of truth for every learning module shown on Home.
 * To add a new module: build its screen under src/modules/<name>,
 * then append one entry here — nothing else in the app needs to change.
 */
export const MODULES: LearningModule[] = [
  {
    id: 'arithmetic',
    title: 'Números',
    subtitle: 'Primeros pasos de aritmética',
    emoji: '🔢',
    color: colors.arithmetic,
    Component: ArithmeticScreen,
    starsGoal: 9,
  },
  {
    id: 'letters',
    title: 'Letras',
    subtitle: 'Aprende a dibujar letras',
    emoji: '✏️',
    color: colors.letters,
    Component: LettersScreen,
    starsGoal: 27,
  },
  {
    id: 'reading',
    title: 'Palabras',
    subtitle: 'Lee tus primeras palabras',
    emoji: '📖',
    color: colors.reading,
    Component: ReadingScreen,
    starsGoal: 9,
  },
];

export function getModuleById(id: string): LearningModule | undefined {
  return MODULES.find((module) => module.id === id);
}
