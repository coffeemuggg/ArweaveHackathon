"use client"

import React, { useEffect } from 'react';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr';

const VideoPlayer = ({ videoUrl }) => {
  useEffect(() => {
    const player = new Plyr('#player');
    return () => {
      player.destroy();
    };
  }, []);

  return (
    <div>
      <div className='w-1/2 '>
        <video id="player" controls playsInline>
          <source src="https://5rbmlkyaasej2bvwgxfi7u5ydx7yh6lhrq4rva34q3zxbmswn3ba.arweave.net/7ELFqwAEiJ0GtjXKj9O4Hf-D-WeMORqDfIbzcLJWbsI" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
