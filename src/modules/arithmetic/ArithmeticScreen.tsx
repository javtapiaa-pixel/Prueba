import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChoiceButton, ScreenHeader, StarBar } from '../../core/widgets';
import { useProgress } from '../../core/ProgressContext';
import { colors, fontSizes, radii, spacing } from '../../theme/theme';
import { generateProblem, type Problem } from './problems';

const MODULE_ID = 'arithmetic';
const TOTAL_ROUNDS = 8;

type Stage = 'intro' | 'playing' | 'result';

export default function ArithmeticScreen() {
  const navigation = useNavigation();
  const { getModuleProgress, addStars, registerSession } = useProgress();
  const moduleProgress = getModuleProgress(MODULE_ID);

  const [stage, setStage] = useState<Stage>('intro');
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);

  const level = useMemo(() => Math.min(3, 1 + Math.floor(correct / 3)), [correct]);

  const startGame = useCallback(() => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setProblem(generateProblem(1));
    setStage('playing');
    registerSession(MODULE_ID);
  }, [registerSession]);

  const nextRound = useCallback(
    (wasCorrect: boolean) => {
      const nextCorrect = correct + (wasCorrect ? 1 : 0);
      const nextRoundIndex = round + 1;
      setCorrect(nextCorrect);
      setSelected(null);

      if (nextRoundIndex >= TOTAL_ROUNDS) {
        const stars = nextCorrect >= 7 ? 3 : nextCorrect >= 5 ? 2 : nextCorrect >= 3 ? 1 : 0;
        setEarnedStars(stars);
        if (stars > 0) addStars(MODULE_ID, stars);
        setStage('result');
        return;
      }

      setRound(nextRoundIndex);
      setProblem(generateProblem(Math.min(3, 1 + Math.floor(nextCorrect / 3))));
    },
    [correct, round, addStars]
  );

  const onAnswer = useCallback(
    (value: number) => {
      if (selected !== null || !problem) return;
      setSelected(value);
      const wasCorrect = value === problem.answer;
      setTimeout(() => nextRound(wasCorrect), 650);
    },
    [selected, problem, nextRound]
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Números" color={colors.arithmetic} onBack={() => navigation.goBack()} />

      {stage === 'intro' && (
        <View style={styles.centerContent}>
          <Text style={styles.introEmoji}>🔢</Text>
          <Text style={styles.introTitle}>Primeros pasos de aritmética</Text>
          <Text style={styles.introBody}>
            Cuenta objetos y suma numeros pequeños. ¡Responde bien para ganar estrellas!
          </Text>
          <StarBar stars={moduleProgress.stars} max={Math.max(3, moduleProgress.stars)} />
          <ChoiceButton label="Jugar ▶" onPress={startGame} />
        </View>
      )}

      {stage === 'playing' && problem && (
        <View style={styles.playArea}>
          <Text style={styles.roundLabel}>
            Ronda {round + 1} de {TOTAL_ROUNDS} · Nivel {level}
          </Text>
          <View style={styles.problemCard}>
            <Text style={styles.objectsText}>{problem.objects}</Text>
            <Text style={styles.promptText}>{problem.prompt}</Text>
          </View>
          <View style={styles.optionsRow}>
            {problem.options.map((option) => {
              let state: 'correct' | 'wrong' | 'idle' | undefined;
              if (selected !== null) {
                if (option === problem.answer) state = 'correct';
                else if (option === selected) state = 'wrong';
              }
              return (
                <ChoiceButton
                  key={option}
                  label={String(option)}
                  state={state}
                  onPress={() => onAnswer(option)}
                />
              );
            })}
          </View>
        </View>
      )}

      {stage === 'result' && (
        <View style={styles.centerContent}>
          <Text style={styles.introEmoji}>{earnedStars >= 2 ? '🏆' : '👍'}</Text>
          <Text style={styles.introTitle}>
            ¡Acertaste {correct} de {TOTAL_ROUNDS}!
          </Text>
          <StarBar stars={earnedStars} max={3} />
          <ChoiceButton label="Jugar de nuevo ▶" onPress={startGame} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  introEmoji: { fontSize: fontSizes.huge },
  introTitle: {
    fontSize: fontSizes.title,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  introBody: {
    fontSize: fontSizes.body,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 320,
  },
  playArea: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  roundLabel: {
    textAlign: 'center',
    fontSize: fontSizes.small,
    color: colors.textLight,
    fontWeight: '700',
  },
  problemCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  objectsText: { fontSize: 40, textAlign: 'center', letterSpacing: 4 },
  promptText: { fontSize: fontSizes.title, fontWeight: '800', color: colors.text },
  optionsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
});
