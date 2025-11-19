/**
 * サウンド再生用の簡易フック
 */

import { useCallback, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';

const SOUND_MAP = {
  matchSmall: require('../../assets/sounds/match_small.mp3'),
  matchBig: require('../../assets/sounds/match_big.mp3'),
  combo: require('../../assets/sounds/combo.mp3'),
  swapFail: require('../../assets/sounds/swap_fail.mp3'),
  stageClear: require('../../assets/sounds/stage_clear.mp3'),
  stageFail: require('../../assets/sounds/stage_fail.mp3'),
  gameOver: require('../../assets/sounds/game_over.mp3'),
  bgmStage: require('../../assets/sounds/bgm_stage1.mp3'),
};

type SoundKey = keyof typeof SOUND_MAP;

export const useSound = () => {
  const soundObjects = useRef<Partial<Record<SoundKey, Audio.Sound>>>({});

  const ensureLoaded = useCallback(async (key: SoundKey) => {
    if (soundObjects.current[key]) return soundObjects.current[key]!;
    const { sound } = await Audio.Sound.createAsync(SOUND_MAP[key], {
      shouldPlay: false,
    });
    soundObjects.current[key] = sound;
    return sound;
  }, []);

  const play = useCallback(
    async (key: SoundKey, loop = false) => {
      try {
        const sound = await ensureLoaded(key);
        await sound.setIsLoopingAsync(loop);
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (e) {
        console.warn('Failed to play sound', key, e);
      }
    },
    [ensureLoaded]
  );

  const stop = useCallback(async (key: SoundKey) => {
    const sound = soundObjects.current[key];
    if (!sound) return;
    const status = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
    if (status.isLoaded && status.isPlaying) {
      await sound.stopAsync();
    }
  }, []);

  const playEffect = useCallback((key: SoundKey) => {
    play(key, false);
  }, [play]);

  const stopEffect = useCallback((key: SoundKey) => {
    stop(key);
  }, [stop]);

  const playBgm = useCallback(() => {
    play('bgmStage', true);
  }, [play]);

  const stopBgm = useCallback(() => {
    stop('bgmStage');
  }, [stop]);

  useEffect(() => {
    return () => {
      Object.values(soundObjects.current).forEach((sound) => {
        sound?.unloadAsync();
      });
    };
  }, []);

  return {
    playEffect,
    stopEffect,
    playBgm,
    stopBgm,
  };
};
