/**
 * ScoreBoardコンポーネントのスタイル
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  movesSection: {
    alignItems: 'center',
    flex: 1,
  },
  highScoreSection: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textAccent,
    marginTop: 5,
  },
  movesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 5,
  },
  movesWarning: {
    color: COLORS.warning,
  },
  highScoreLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
});
