/**
 * Headerコンポーネントのスタイル
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: '100%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  moodText: {
    color: '#FF6FAF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6A6A6A',
  },
});
