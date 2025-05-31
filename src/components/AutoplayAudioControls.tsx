
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAutoplayAudio } from '@/hooks/useAutoplayAudio';

interface AutoplayAudioControlsProps {
  audios: Array<{
    url: string;
    title: string;
    duration?: number;
  }>;
  autoplayEnabled: boolean;
}

const AutoplayAudioControls = ({ audios, autoplayEnabled }: AutoplayAudioControlsProps) => {
  const { isPlaying, showPlayButton, currentAudio, togglePlayPause, playAudio } = useAutoplayAudio(audios, autoplayEnabled);

  if (!audios.length || !autoplayEnabled) {
    console.log('AutoplayAudioControls: not rendering - no audios or autoplay disabled');
    return null;
  }

  console.log('AutoplayAudioControls: rendering with isPlaying:', isPlaying, 'showPlayButton:', showPlayButton);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showPlayButton && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg mb-4 max-w-xs animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Áudio Disponível</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            {currentAudio?.title || 'Mensagem de áudio'}
          </p>
          <Button onClick={playAudio} size="sm" className="w-full">
            <Play className="h-4 w-4 mr-1" />
            Reproduzir
          </Button>
        </div>
      )}
      
      {(isPlaying || (!showPlayButton && audios.length > 0)) && (
        <Button
          onClick={togglePlayPause}
          size="icon"
          className={`rounded-full shadow-lg transition-all duration-200 ${
            isPlaying 
              ? "bg-primary text-white animate-pulse" 
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
          variant={isPlaying ? "default" : "outline"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 bg-black bg-opacity-75 text-white p-2 rounded">
          Playing: {isPlaying ? 'Yes' : 'No'}<br/>
          Show Button: {showPlayButton ? 'Yes' : 'No'}<br/>
          Audios: {audios.length}<br/>
          Current: {currentAudio?.title || 'None'}
        </div>
      )}
    </div>
  );
};

export default AutoplayAudioControls;
