import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VideoCard from '../../components/VideoCard';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  wallet_address: string;
}

const VideoDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [content, setContent] = useState<Video[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllData');
        const data = await response.json();
        setContent(data.body);

        if (id) {
          const videoData = data.body.find((item: Video) => item.id === id);
          setVideo(videoData || null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!video) {
    return <div className='min-h-screen text-2xl flex items-center justify-center text-white text-center'>Loading...</div>;
  }

  return (
    <div className='py-6 mx-36'>
      <div className='grid place-items-center'>
        <video className="w-3/4 rounded-t-xl" id="player" controls playsInline>
          <source src={video.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className='w-3/4 bg-white p-4 rounded-b-xl'>
          <h2 className='text-2xl font-semibold'>{video.title}</h2>
          <p>{video.description}</p>
        </div>
      </div>

      <div className="flex justify-center items-center py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content && content.length > 0 ? (
            content.map((item: Video, index: number) => (
              <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
                <a target="_blank" rel="noopener noreferrer">
                  <div className={item.video_url === video.video_url ? 'hidden' : ''}>
                    <VideoCard
                      imageSrc={item.thumbnail_url}
                      title={item.title}
                      description={item.description}
                      videoUrl={item.video_url}
                    />
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className='flex items-center justify-center pt-56'>
              <p className='text-3xl text-white'>Loading content....</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
