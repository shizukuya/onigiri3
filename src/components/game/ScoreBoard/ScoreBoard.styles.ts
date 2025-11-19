/**
 * ScoreBoardコンポーネントのスタイル
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 14,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 8,
    color: '#7A7A7A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 2,
  },
  movesWarning: {
    color: '#FF6B6B',
  },
  livesCard: {
    width: 90,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livesRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  heartIcon: {
    marginHorizontal: 2,
  },
  livesCount: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 6,
  },
  progressCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressTitle: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 12,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
  },
  progressCaption: {
    fontSize: 12,
    color: '#7A7A7A',
  },
});
