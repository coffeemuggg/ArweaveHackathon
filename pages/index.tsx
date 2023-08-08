import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import VideoCard from '../components/VideoCard';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  wallet_address: string;
}

const Index = () => {
  const [content, setContent] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllData');
        const data = await response.json();
        setContent(data.body);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <div className='grid place-items-center'>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex justify-center items-center py-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content && content.length > 0 ? (
              content.map((item: Video, index: number) => (
                <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
                  <a>
                    <VideoCard
                      imageSrc={item.thumbnail_url}
                      title={item.title}
                      description={item.description}
                      videoUrl={item.video_url}
                    />
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
    </div>
  );
};

export default Index;
