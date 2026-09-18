export interface WordEntry {
  word: string;
  emoji: string;
}

export const WORDS: WordEntry[] = [
  { word: 'SOL', emoji: '☀️' },
  { word: 'GATO', emoji: '🐱' },
  { word: 'CASA', emoji: '🏠' },
  { word: 'LUNA', emoji: '🌙' },
  { word: 'PEZ', emoji: '🐟' },
  { word: 'OSO', emoji: '🐻' },
  { word: 'PAN', emoji: '🍞' },
  { word: 'FLOR', emoji: '🌸' },
  { word: 'MAR', emoji: '🌊' },
  { word: 'OJO', emoji: '👁️' },
  { word: 'PATO', emoji: '🦆' },
  { word: 'RATÓN', emoji: '🐭' },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface WordRound {
  target: WordEntry;
  options: string[];
}

export function generateWordRound(): WordRound {
  const targetIndex = randomInt(0, WORDS.length - 1);
  const target = WORDS[targetIndex];
  const distractorPool = WORDS.filter((_, i) => i !== targetIndex);
  const distractors: string[] = [];
  while (distractors.length < 2 && distractorPool.length > 0) {
    const pickIndex = randomInt(0, distractorPool.length - 1);
    const [picked] = distractorPool.splice(pickIndex, 1);
    distractors.push(picked.word);
  }
  const options = [target.word, ...distractors].sort(() => Math.random() - 0.5);
  return { target, options };
}
