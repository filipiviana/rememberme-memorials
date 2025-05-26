
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Video, Play, Pause } from 'lucide-react';
import FileUpload from './FileUpload';

interface VideoFile {
  url: string;
  title: string;
}

interface VideoUploadProps {
  videos: VideoFile[];
  onVideosChange: (videos: VideoFile[]) => void;
}

const VideoUpload = ({ videos, onVideosChange }: VideoUploadProps) => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);

  const handleAddVideo = (url: string) => {
    const newVideo: VideoFile = {
      url,
      title: `Vídeo ${videos.length + 1}`
    };
    onVideosChange([...videos, newVideo]);
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    onVideosChange(updatedVideos);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedVideos = videos.map((video, i) => 
      i === index ? { ...video, title } : video
    );
    onVideosChange(updatedVideos);
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
      <Label>Arquivos de Vídeo</Label>
      
      <FileUpload
        label="Adicionar Vídeo"
        accept="video/*"
        onUpload={handleAddVideo}
        maxSize={50 * 1024 * 1024} // 50MB for video
      />

      {videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-blue-500" />
                  <Input
                    value={video.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Nome do vídeo"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveVideo(index)}
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
                {currentPlaying === index ? (
                  <video
                    src={video.url}
                    controls
                    className="flex-1 max-h-32 rounded"
                    onEnded={() => setCurrentPlaying(null)}
                  />
                ) : (
                  <span className="text-sm text-gray-500 flex-1">
                    Clique em play para assistir
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

export default VideoUpload;
