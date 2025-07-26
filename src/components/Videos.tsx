import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { supabase, Video } from '../lib/supabase';

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке видео');
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (video: Video) => {
    // Redirect to the specified URL instead of opening modal
    if (video.redirect_url) {
      window.open(video.redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeVideoModal();
      }
    };

    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedVideo]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 font-light">Загрузка видео...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-thin tracking-wider text-white mb-4">
            Видео
          </h2>
          <div className="w-16 h-px bg-white mx-auto mb-6"></div>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Погрузитесь в мир САБИНА МАК через наши эксклюзивные видео
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 font-light">Видео пока не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer relative overflow-hidden rounded-lg"
                onClick={() => openVideoModal(video)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-video mb-4 rounded-lg group">
                  <video
                    src={video.video_path}
                    poster={video.thumbnail}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-gray-900 font-light tracking-wide">Смотреть</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 
                                  text-sm font-light tracking-wide rounded">
                      {video.caption}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-white group-hover:text-gray-300 
                               transition-colors duration-200">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Videos;