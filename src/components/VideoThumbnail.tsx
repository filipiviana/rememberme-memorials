
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface VideoThumbnailProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

const VideoThumbnail = ({ videoUrl, title = "Vídeo", className = "" }: VideoThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Wait for video to load metadata
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
        video.load();
      });

      // Set canvas dimensions
      canvas.width = 320;
      canvas.height = 180;

      // Seek to 1 second or 10% of duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;

      // Wait for seek to complete
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
        }
        setIsLoading(false);
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Error generating thumbnail:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateThumbnail();

    // Cleanup URL when component unmounts
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      {/* Hidden video and canvas for thumbnail generation */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        muted
        preload="metadata"
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} className="hidden" />

      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : hasError || !thumbnailUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-500">
                <Video className="h-8 w-8 mb-2" />
                <span className="text-sm">{title}</span>
              </div>
            ) : (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            )}
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white bg-opacity-90 rounded-full p-3">
                <Play className="h-6 w-6 text-gray-800 fill-current" />
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-[80vh] rounded-lg"
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoThumbnail;
