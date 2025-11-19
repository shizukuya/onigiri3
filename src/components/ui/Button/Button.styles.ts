/**
 * Buttonコンポーネントのスタイル
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPrimary: {
    backgroundColor: COLORS.buttonPrimary,
    shadowColor: COLORS.buttonPrimary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.buttonSecondary,
    shadowColor: COLORS.buttonSecondary,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
    shadowColor: COLORS.shadow,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
});
