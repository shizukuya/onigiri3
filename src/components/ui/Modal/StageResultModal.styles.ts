/**
 * StageResultModal スタイル
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
    padding: 32,
    alignItems: 'center',
    minWidth: 320,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 2,
  },
  levelName: {
    fontSize: 16,
    color: COLORS.textAccent,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreBlock: {
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  lives: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 12,
  },
  buttonRow: {
    width: '100%',
    marginTop: 10,
  },
  secondaryButton: {
    marginTop: 10,
  },
  fullWidthButton: {
    width: '100%',
  },
});
