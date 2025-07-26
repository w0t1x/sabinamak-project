import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, Loader2 } from 'lucide-react';
import { supabase, Collection } from '../lib/supabase';

const Collections: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке коллекций');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 font-light">Загрузка коллекций...</p>
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
              <button
                onClick={fetchCollections}
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
            Коллекции
          </h2>
          <div className="w-16 h-px bg-white mx-auto mb-6"></div>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Каждая вещь от «САБИНА МАК» — это не просто одежда, а искусство самовыражения. 
            Мы создаём элегантные силуэты и смелые дизайны, вдохновленные динамикой современной жизни и вечной классикой.
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 font-light">Коллекции пока не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group cursor-pointer"
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                  <img
                    src={collection.images[0]}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Eye size={20} className="text-gray-900" />
                    </div>
                  </div>
                  {collection.featured && (
                    <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 
                                  text-xs font-light tracking-wide">
                      РЕКОМЕНДУЕМОЕ
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-white group-hover:text-gray-300 
                               transition-colors duration-200">
                    {collection.title}
                  </h3>
                  <p className="text-sm font-light text-gray-400 tracking-wide">
                    {collection.season}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Modal */}
        {selectedCollection && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                      {selectedCollection.title}
                    </h3>
                    <p className="text-sm font-light text-gray-500 tracking-wide">
                      {selectedCollection.season}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedCollection.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCollection.images.map((image, index) => (
                    <div key={index} className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`${selectedCollection.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 
                                 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;