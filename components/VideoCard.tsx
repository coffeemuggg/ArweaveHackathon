import React, { useState, useEffect } from 'react';

interface CardProps {
  videoUrl: string;
  imageSrc: string;
  title: string;
  description: string;
}

const VideoCard: React.FC<CardProps> = ({ videoUrl, imageSrc, title, description }) => {
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const truncatedDescription = description.split(' ').slice(0, 15).join(' ');

  useEffect(() => {
    // Create a video element to retrieve the duration
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;

    videoElement.addEventListener('loadedmetadata', () => {
      setVideoDuration(videoElement.duration);
    });

    // Clean up the video element
    return () => {
      videoElement.removeEventListener('loadedmetadata', () => { });
    };
  }, [videoUrl]);

  return (
    <div className="max-w-sm cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg">
      <img className="w-full h-32 object-cover" src={imageSrc} alt={title} />
      <div className="px-4 py-2">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-800 text-base">
          {truncatedDescription}
          {description.split(' ').length > 15 ? '...' : ''}
        </p>
        {videoDuration !== null && (
          <p className="text-gray-600">Duration: {videoDuration.toFixed(2)} seconds</p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
