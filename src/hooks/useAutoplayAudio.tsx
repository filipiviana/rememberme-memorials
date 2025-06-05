
import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioFile {
  url: string;
  title: string;
  duration?: number;
}

export const useAutoplayAudio = (audios: AudioFile[], autoplayEnabled: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      audioRef.current.removeEventListener('pause', handleAudioPause);
      audioRef.current.removeEventListener('play', handleAudioPlay);
      audioRef.current.removeEventListener('loadeddata', handleAudioReady);
      audioRef.current.removeEventListener('error', handleAudioError);
      if (audioRef.current.parentNode) {
        audioRef.current.parentNode.removeChild(audioRef.current);
      }
      audioRef.current = null;
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setShowPlayButton(true);
  }, []);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
    setShowPlayButton(false);
  }, []);

  const handleAudioReady = useCallback(() => {
    setAudioReady(true);
  }, []);

  const handleAudioError = useCallback((e: Event) => {
    console.error('useAutoplayAudio: audio error:', e);
    setShowPlayButton(true);
    setAudioReady(false);
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !audios.length || !audioReady) {
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setShowPlayButton(false);
      }
    } catch (error) {
      console.log('Error playing audio:', error);
      setShowPlayButton(true);
      setIsPlaying(false);
    }
  }, [audios.length, audioReady]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio, pauseAudio]);

  useEffect(() => {
    if (!audios.length) {
      cleanupAudio();
      setShowPlayButton(false);
      setAudioReady(false);
      return;
    }

    // Create audio element
    const audio = new Audio();
    audio.src = audios[0].url;
    audio.preload = 'metadata';
    
    // Add to DOM (hidden)
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('loadeddata', handleAudioReady);
    audio.addEventListener('error', handleAudioError);

    // Listen for external audio stop events
    const handleStopAllAudio = (event: CustomEvent) => {
      if (event.detail.source !== 'autoplay') {
        pauseAudio();
      }
    };
    window.addEventListener('stopAllAudio', handleStopAllAudio as EventListener);

    return () => {
      window.removeEventListener('stopAllAudio', handleStopAllAudio as EventListener);
      cleanupAudio();
    };
  }, [audios, pauseAudio, cleanupAudio, handleAudioEnded, handleAudioPause, handleAudioPlay, handleAudioReady, handleAudioError]);

  return {
    isPlaying,
    showPlayButton: showPlayButton && audios.length > 0,
    currentAudio: audios[currentAudioIndex],
    togglePlayPause,
    playAudio,
    pauseAudio
  };
};
