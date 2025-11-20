import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { loadGameData } from '../utils/storage';

// Sound mapping
const SOUND_MAP = {
  move: require('../../assets/sounds/move.mp3'),
  matchSmall: require('../../assets/sounds/match_small.mp3'), // Fixed path
  matchBig: require('../../assets/sounds/match_big.mp3'),     // Fixed path
  combo: require('../../assets/sounds/combo.mp3'),
  bomb: require('../../assets/sounds/bomb.mp3'),
  bombVoice: require('../../assets/sounds/bomb-voice.mp3'),
  dokan: require('../../assets/sounds/dokan.mp3'),
  ring: require('../../assets/sounds/ring.mp3'),
  kesigomu: require('../../assets/sounds/kesigomu.mp3'),
  stageClear: require('../../assets/sounds/stage_clear.mp3'),
  stageFail: require('../../assets/sounds/stage_fail.mp3'),
  gameOver: require('../../assets/sounds/game_over.mp3'),
  reset: require('../../assets/sounds/reset.mp3'),
  down: require('../../assets/sounds/down.mp3'),
  superpink: require('../../assets/sounds/superpink.mp3'),
  superpinkVoice: require('../../assets/sounds/superpink-voice.mp3'),
};

// BGM_MAP - statically defined (React Native doesn't support dynamic require)
const BGM_MAP: { [key: string]: any } = {
  'bgm_stage1.mp3': require('../../assets/sounds/bgm_stage1.mp3'),
  'bgm_stage2.mp3': require('../../assets/sounds/bgm_stage2.mp3'),
  'bgm_stage3.mp3': require('../../assets/sounds/bgm_stage3.mp3'),
  'bgm_stage4.mp3': require('../../assets/sounds/bgm_stage4.mp3'),
  'bgm_stage5.mp3': require('../../assets/sounds/bgm_stage5.mp3'),
  'bgm_stage6.mp3': require('../../assets/sounds/bgm_stage6.mp3'),
};

export const useSound = () => {
  const bgmSoundRef = useRef<Audio.Sound | null>(null);
  const currentBgmNameRef = useRef<string | null>(null);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      if (bgmSoundRef.current) {
        bgmSoundRef.current.unloadAsync();
        bgmSoundRef.current = null;
        currentBgmNameRef.current = null;
      }
    };
  }, []);

  const playEffect = useCallback(async (name: keyof typeof SOUND_MAP, options?: { pitch?: number }) => {
    try {
      // Check settings first
      const data = await loadGameData();
      // Assuming we might have a separate sound effect toggle later, 
      // but for now let's just play effects always or check bgmEnabled if that covers both?
      // Usually BGM and SE are separate. Let's assume SE is always on or add a toggle later.
      // For now, just play.

      const { sound } = await Audio.Sound.createAsync(SOUND_MAP[name]);

      if (options?.pitch) {
        await sound.setRateAsync(options.pitch, false);
      }

      await sound.playAsync();

      // Unload after playing
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      // console.log('Failed to play sound', error);
    }
  }, []);

  const playBgm = useCallback(async (bgmName: string = 'bgm_stage1.mp3') => {
    try {
      // Check settings
      const data = await loadGameData();
      if (!data.bgmEnabled) return;

      // If already playing the same BGM, do nothing
      if (bgmSoundRef.current && currentBgmNameRef.current === bgmName) return;

      // If playing different BGM, stop it
      if (bgmSoundRef.current) {
        await bgmSoundRef.current.stopAsync();
        await bgmSoundRef.current.unloadAsync();
        bgmSoundRef.current = null;
        currentBgmNameRef.current = null;
      }

      const source = BGM_MAP[bgmName] || BGM_MAP['bgm_stage1.mp3'];
      const { sound } = await Audio.Sound.createAsync(
        source,
        { isLooping: true, volume: 0.4 }
      );
      bgmSoundRef.current = sound;
      currentBgmNameRef.current = bgmName;
      await sound.playAsync();
    } catch (error) {
      console.log('Failed to play BGM', error);
    }
  }, []);

  const stopBgm = useCallback(async () => {
    if (bgmSoundRef.current) {
      await bgmSoundRef.current.stopAsync();
      await bgmSoundRef.current.unloadAsync();
      bgmSoundRef.current = null;
      currentBgmNameRef.current = null;
    }
  }, []);

  return {
    playEffect,
    playBgm,
    stopBgm,
  };
};
