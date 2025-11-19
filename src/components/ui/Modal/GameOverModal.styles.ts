/**
 * GameOverModalコンポーネントのスタイル
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.boardBackground,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    minWidth: 300,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    letterSpacing: 2,
  },
  newHighScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textAccent,
    marginBottom: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textAccent,
  },
  highScoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  highScoreLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
