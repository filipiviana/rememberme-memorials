
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Music, Play, Pause } from 'lucide-react';
import FileUpload from './FileUpload';

interface AudioFile {
  url: string;
  title: string;
}

interface AudioUploadProps {
  audios: AudioFile[];
  onAudiosChange: (audios: AudioFile[]) => void;
}

const AudioUpload = ({ audios, onAudiosChange }: AudioUploadProps) => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);

  const handleAddAudio = (url: string) => {
    const newAudio: AudioFile = {
      url,
      title: `Áudio ${audios.length + 1}`
    };
    onAudiosChange([...audios, newAudio]);
  };

  const handleRemoveAudio = (index: number) => {
    const updatedAudios = audios.filter((_, i) => i !== index);
    onAudiosChange(updatedAudios);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedAudios = audios.map((audio, i) => 
      i === index ? { ...audio, title } : audio
    );
    onAudiosChange(updatedAudios);
  };

  const togglePlay = (index: number) => {
    if (currentPlaying === index) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(index);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Arquivos de Áudio</Label>
      
      <FileUpload
        label="Adicionar Áudio"
        accept="audio/*"
        onUpload={handleAddAudio}
        maxSize={10 * 1024 * 1024} // 10MB for audio
      />

      {audios.length > 0 && (
        <div className="space-y-3">
          {audios.map((audio, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-purple-500" />
                  <Input
                    value={audio.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Nome do áudio"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAudio(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => togglePlay(index)}
                >
                  {currentPlaying === index ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <audio
                  src={audio.url}
                  controls={currentPlaying === index}
                  className={currentPlaying === index ? 'flex-1' : 'hidden'}
                  onEnded={() => setCurrentPlaying(null)}
                />
                {currentPlaying !== index && (
                  <span className="text-sm text-gray-500 flex-1">
                    Clique em play para ouvir
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
