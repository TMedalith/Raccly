import { useCallback, useRef, useEffect } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  // Limpiar recursos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    queueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const playNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      stop();
      return;
    }

    const nextAudio = queueRef.current.shift();
    if (!nextAudio) {
      stop();
      return;
    }

    // Detener el audio anterior si existe
    stop();

    // Crear una nueva instancia de Audio
    const audio = new Audio(nextAudio);
    audio.volume = 0.6;

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        playNext();
      }
    };

    audio.onerror = () => {
      console.warn(`Failed to load audio: ${nextAudio}`);
      if (audioRef.current === audio) {
        audioRef.current = null;
        playNext();
      }
    };

    // Asignar el nuevo audio
    audioRef.current = audio;
    
    // Reproducir el nuevo audio
    audio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
      if (audioRef.current === audio) {
        audioRef.current = null;
        playNext();
      }
    });
  }, [stop]);

  const play = useCallback((audioPath: string | string[]) => {
    // Asegurarse de que cualquier audio anterior se detenga completamente
    stop();

    // Iniciar la nueva reproducción en el siguiente frame
    requestAnimationFrame(() => {
      const paths = Array.isArray(audioPath) ? audioPath : [audioPath];
      queueRef.current = paths.map(path => `/mp3/${path}`);
      isPlayingRef.current = true;
      playNext();
    });
  }, [playNext, stop]);

  return { play, stop };
}
