import { useCallback, useRef } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const playNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const nextAudio = queueRef.current.shift();
    if (!nextAudio) {
      isPlayingRef.current = false;
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    audioRef.current = new Audio(nextAudio);
    audioRef.current.volume = 0.6;

    audioRef.current.onended = () => {
      playNext();
    };

    audioRef.current.onerror = () => {
      console.warn(`Failed to load audio: ${nextAudio}`);
      playNext();
    };

    audioRef.current.play().catch((error) => {
      console.warn('Audio playback failed:', error);
      playNext();
    });
  }, []);

  const play = useCallback((audioPath: string | string[]) => {
    const paths = Array.isArray(audioPath) ? audioPath : [audioPath];

    if (isPlayingRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      queueRef.current = [];
    }

    queueRef.current = paths.map(path => `/mp3/${path}`);
    isPlayingRef.current = true;
    playNext();
  }, [playNext]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    queueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  return { play, stop };
}
