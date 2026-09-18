export type ProblemKind = 'count' | 'add';

export interface Problem {
  kind: ProblemKind;
  prompt: string;
  objects: string; // emoji repeated `answer` times, or split for addition
  groupA?: number;
  groupB?: number;
  answer: number;
  options: number[];
}

const OBJECT_EMOJI = ['🍎', '🍓', '⭐', '🐟', '🎈', '🍪', '🚗', '🦋'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffledOptions(answer: number, maxValue: number): number[] {
  const options = new Set<number>([answer]);
  while (options.size < 3) {
    const candidate = randomInt(Math.max(0, answer - 3), Math.min(maxValue, answer + 3));
    options.add(candidate);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function generateProblem(level: number): Problem {
  const emoji = OBJECT_EMOJI[randomInt(0, OBJECT_EMOJI.length - 1)];
  const isAddition = level > 1 && Math.random() > 0.4;

  if (isAddition) {
    const groupA = randomInt(1, level === 2 ? 3 : 5);
    const groupB = randomInt(1, level === 2 ? 3 : 5);
    const answer = groupA + groupB;
    return {
      kind: 'add',
      prompt: `${groupA} + ${groupB} = ?`,
      objects: emoji.repeat(groupA) + '  ' + emoji.repeat(groupB),
      groupA,
      groupB,
      answer,
      options: shuffledOptions(answer, 10),
    };
  }

  const answer = randomInt(1, level === 1 ? 5 : 8);
  return {
    kind: 'count',
    prompt: '¿Cuántos hay?',
    objects: emoji.repeat(answer),
    answer,
    options: shuffledOptions(answer, 8),
  };
}
