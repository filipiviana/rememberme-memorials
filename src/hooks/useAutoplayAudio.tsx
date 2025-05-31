
import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioFile {
  url: string;
  title: string;
  duration?: number;
}

export const useAutoplayAudio = (audios: AudioFile[], autoplayEnabled: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('useAutoplayAudio: audios count:', audios.length, 'autoplayEnabled:', autoplayEnabled);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      console.log('useAutoplayAudio: cleaning up audio element');
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
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    console.log('useAutoplayAudio: audio ended');
    setIsPlaying(false);
  }, []);

  const handleAudioPause = useCallback(() => {
    console.log('useAutoplayAudio: audio paused');
    setIsPlaying(false);
  }, []);

  const handleAudioPlay = useCallback(() => {
    console.log('useAutoplayAudio: audio playing');
    setIsPlaying(true);
    setShowPlayButton(false);
  }, []);

  const handleAudioReady = useCallback(() => {
    console.log('useAutoplayAudio: audio ready');
    setAudioReady(true);
  }, []);

  const handleAudioError = useCallback((e: Event) => {
    console.error('useAutoplayAudio: audio error:', e);
    setShowPlayButton(true);
    setAudioReady(false);
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !audios.length || !audioReady) {
      console.log('useAutoplayAudio: cannot play - no audio or not ready');
      return;
    }

    try {
      console.log('useAutoplayAudio: attempting to play audio');
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('useAutoplayAudio: audio playing successfully');
        setIsPlaying(true);
        setShowPlayButton(false);
      }
    } catch (error) {
      console.log('useAutoplayAudio: autoplay blocked by browser:', error);
      setShowPlayButton(true);
      setIsPlaying(false);
    }
  }, [audios.length, audioReady]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      console.log('useAutoplayAudio: pausing audio');
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

  // Stop external audio players
  const stopExternalAudio = useCallback(() => {
    // Dispatch custom event to stop other audio players
    window.dispatchEvent(new CustomEvent('stopAllAudio', { detail: { source: 'autoplay' } }));
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || !audios.length) {
      console.log('useAutoplayAudio: autoplay disabled or no audios');
      cleanupAudio();
      setShowPlayButton(false);
      setAudioReady(false);
      return;
    }

    console.log('useAutoplayAudio: setting up audio for:', audios[0].url);
    
    // Create audio element
    const audio = new Audio();
    audio.src = audios[0].url;
    audio.preload = 'auto';
    
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
        console.log('useAutoplayAudio: stopping due to external audio');
        pauseAudio();
      }
    };
    window.addEventListener('stopAllAudio', handleStopAllAudio as EventListener);

    // Try to autoplay after audio is ready
    const attemptAutoplay = () => {
      if (audioReady) {
        stopExternalAudio();
        playAudio();
      }
    };

    // Set up retry mechanism
    retryTimeoutRef.current = setTimeout(attemptAutoplay, 1000);

    return () => {
      window.removeEventListener('stopAllAudio', handleStopAllAudio as EventListener);
      cleanupAudio();
    };
  }, [audios, autoplayEnabled, audioReady, playAudio, pauseAudio, stopExternalAudio, cleanupAudio, handleAudioEnded, handleAudioPause, handleAudioPlay, handleAudioReady, handleAudioError]);

  // Attempt autoplay when audio becomes ready
  useEffect(() => {
    if (audioReady && autoplayEnabled && audios.length > 0 && !isPlaying) {
      console.log('useAutoplayAudio: audio ready, attempting autoplay');
      stopExternalAudio();
      playAudio();
    }
  }, [audioReady, autoplayEnabled, audios.length, isPlaying, playAudio, stopExternalAudio]);

  return {
    isPlaying,
    showPlayButton,
    currentAudio: audios[currentAudioIndex],
    togglePlayPause,
    playAudio,
    pauseAudio
  };
};
