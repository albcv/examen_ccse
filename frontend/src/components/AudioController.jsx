import { useRef, useEffect } from 'react';
import sonido from '../audio/sonido.mp3'

export function AudioController({ shouldPlay, isEnabled }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (shouldPlay && isEnabled) {
      audioRef.current.play().catch(error => {
        console.log('Error al reproducir audio:', error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [shouldPlay, isEnabled]);

  return <audio ref={audioRef} src={sonido} loop />;
}