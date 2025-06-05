
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface FeaturedVideoProps {
  videoUrl: string;
  title?: string;
}

const FeaturedVideo = ({ videoUrl, title = "Vídeo em Destaque" }: FeaturedVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Autoplay when video comes into view
          video.play().catch(() => {
            // Autoplay blocked by browser, just continue
          });
        } else {
          // Pause when video goes out of view
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls={false}
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta reprodução de vídeo.
      </video>
      
      {/* Custom Play/Pause Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200">
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-gray-800" />
          ) : (
            <Play className="h-6 w-6 text-gray-800 ml-1" />
          )}
        </button>
      </div>

      {/* Video Title */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="text-white font-medium">{title}</h3>
      </div>
    </div>
  );
};

export default FeaturedVideo;
