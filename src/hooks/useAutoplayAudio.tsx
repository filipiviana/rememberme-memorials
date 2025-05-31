
import { useState, useEffect, useRef } from 'react';

interface AudioFile {
  url: string;
  title: string;
  duration?: number;
}

export const useAutoplayAudio = (audios: AudioFile[], autoplayEnabled: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (!audioRef.current || !audios.length) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (error) {
      console.log('Autoplay blocked by browser:', error);
      setShowPlayButton(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    if (!autoplayEnabled || !audios.length) return;

    // Create audio element
    const audio = new Audio(audios[0].url);
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    // Try to autoplay after a short delay
    const timer = setTimeout(() => {
      playAudio();
    }, 1000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.remove();
    };
  }, [audios, autoplayEnabled]);

  return {
    isPlaying,
    showPlayButton,
    currentAudio: audios[currentAudioIndex],
    togglePlayPause,
    playAudio
  };
};
