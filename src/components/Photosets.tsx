import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink, Loader2 } from 'lucide-react';
import { supabase, Photoset } from '../lib/supabase';

const Photosets: React.FC = () => {
  const [selectedPhotoset, setSelectedPhotoset] = useState<Photoset | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [photosets, setPhotosets] = useState<Photoset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotosets();
  }, []);

  const fetchPhotosets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photosets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotosets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке фотосетов');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'editorial', label: 'Редакционные' },
    { id: 'campaign', label: 'Кампании' },
    { id: 'lookbook', label: 'Лукбуки' }
  ];

  const filteredPhotosets = activeCategory === 'all' 
    ? photosets 
    : photosets.filter(photoset => photoset.category === activeCategory);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'editorial': return 'РЕДАКЦИОННЫЕ';
      case 'campaign': return 'КАМПАНИИ';
      case 'lookbook': return 'ЛУКБУКИ';
      default: return category.toUpperCase();
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 font-light">Загрузка фотосетов...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPhotosets}
                className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-200"
              >
                Попробовать снова
              </button>
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
            Фотосеты
          </h2>
          <div className="w-16 h-px bg-white mx-auto mb-6"></div>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Мы не должны забывать, что «встречают по одежке, провожают по уму». 
            И как говорила великая Коко: «У вас не будет второго шанса, чтобы произвести первое впечатление»
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-white rounded-full p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-light tracking-wide 
                          transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPhotosets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 font-light">
              {activeCategory === 'all' ? 'Фотосеты пока не добавлены' : 'Нет фотосетов в этой категории'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPhotosets.map((photoset) => (
              <div
                key={photoset.id}
                className="group cursor-pointer"
                onClick={() => setSelectedPhotoset(photoset)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-4">
                  <img
                    src={photoset.images[0]}
                    alt={photoset.title}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Camera size={20} className="text-gray-900" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 
                                px-3 py-1 text-xs font-light tracking-wide rounded-full">
                    {getCategoryLabel(photoset.category)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-white group-hover:text-gray-300 
                               transition-colors duration-200">
                    {photoset.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm font-light text-gray-400">
                    <span>{photoset.location}</span>
                    <span>•</span>
                    <span>{photoset.photographer}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {photoset.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photoset Modal */}
        {selectedPhotoset && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                      {selectedPhotoset.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm font-light text-gray-500 mb-2">
                      <span>{selectedPhotoset.location}</span>
                      <span>•</span>
                      <span>Фотография: {selectedPhotoset.photographer}</span>
                    </div>
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 
                                   text-xs font-light tracking-wide rounded-full">
                      {getCategoryLabel(selectedPhotoset.category)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPhotoset(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedPhotoset.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedPhotoset.images.map((image, index) => (
                    <div key={index} className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`${selectedPhotoset.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 
                                 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gray-900 text-white 
                             px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <span className="font-light tracking-wide">Посмотреть в Instagram</span>
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href="https://t.me/Sabina_Mak_brand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 border border-gray-900 
                             text-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white 
                             transition-colors duration-200"
                  >
                    <span className="font-light tracking-wide">Подписаться в Telegram</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Photosets;