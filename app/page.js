"use client"

import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import VideoCard from './components/VideoCard';

const videos = [
  { title: 'Video 1', amount: 0, videoSrc: 'https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI' },
  { title: 'Video 2', amount: 0.5, videoSrc: 'https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI' },
  { title: 'Video 3', amount: 1.2, videoSrc: 'https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI' },
  { title: 'Video 4', amount: 1.2, videoSrc: 'https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI' },
  { title: 'Video 5', amount: 1.2, videoSrc: 'https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI' },
];

export default function page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVideoIndex, setExpandedVideoIndex] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Reorder the videos array to place the expanded video first
  const reorderedVideos = expandedVideoIndex !== null
    ? [videos[expandedVideoIndex], ...videos.slice(0, expandedVideoIndex), ...videos.slice(expandedVideoIndex + 1)]
    : videos;

  return (
    <div>
      <div className='grid place-items-center'>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-wrap space-x-6 items-start justify-center">
        {reorderedVideos.map((video, index) => (
          <VideoCard
            key={index}
            title={video.title}
            amount={video.amount}
            videoSrc={video.videoSrc}
            onClick={() => setExpandedVideoIndex(index)}
            isExpanded={expandedVideoIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
