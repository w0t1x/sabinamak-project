import React, { useState, useEffect } from 'react';
import { supabase, Photoset } from '../../lib/supabase';
import { uploadFile, validateFile, deleteFile } from '../../lib/storage';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

const PhotosetsManager: React.FC = () => {
  const [photosets, setPhotosets] = useState<Photoset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    photographer: '',
    images: [] as string[],
    category: 'editorial' as 'editorial' | 'campaign' | 'lookbook'
  });

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
      setError(err instanceof Error ? err.message : 'Ошибка загрузки фотосетов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const photosetData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== '')
      };

      if (editingId) {
        const { error } = await supabase
          .from('photosets')
          .update(photosetData)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photosets')
          .insert([photosetData]);
        
        if (error) throw error;
      }

      await fetchPhotosets();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleEdit = (photoset: Photoset) => {
    setFormData({
      title: photoset.title,
      description: photoset.description,
      location: photoset.location,
      photographer: photoset.photographer,
      images: photoset.images || [],
      category: photoset.category
    });
    setEditingId(photoset.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот фотосет?')) return;

    try {
      const { error } = await supabase
        .from('photosets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPhotosets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      photographer: '',
      images: [],
      category: 'editorial'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const validation = validateFile(file, 'image');
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        const result = await uploadFile(file, 'website-images', 'photosets');
        if (result.error) {
          throw new Error(result.error);
        }
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображений');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'editorial': return 'Редакционные';
      case 'campaign': return 'Кампании';
      case 'lookbook': return 'Лукбуки';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка фотосетов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Назад к панели
              </a>
              <h1 className="text-xl font-light text-gray-900">
                Управление фотосетами
              </h1>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 
                       hover:bg-gray-800 transition-colors duration-200"
            >
              <Plus size={16} />
              <span>Добавить фотосет</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <div className="font-medium mb-2">Ошибка:</div>
            <div className="text-sm">{error}</div>
            {error.includes('не найдено') && (
              <div className="mt-2 text-sm">
                <strong>Инструкция:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Откройте панель Supabase Dashboard</li>
                  <li>Перейдите в раздел "Storage"</li>
                  <li>Создайте bucket с именем "website-images"</li>
                  <li>Создайте bucket с именем "website-videos"</li>
                  <li>Настройте публичный доступ для обоих buckets</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Редактировать фотосет' : 'Добавить фотосет'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="editorial">Редакционные</option>
                    <option value="campaign">Кампании</option>
                    <option value="lookbook">Лукбуки</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Локация *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Фотограф *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Изображения
                </label>
                
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Выберите изображения (JPEG, PNG, WebP, максимум 10MB каждое)
                </p>
                
                {uploading && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">Загрузка изображений...</span>
                  </div>
                )}
                
                {/* Preview uploaded images */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Загруженные изображения ({formData.images.length}):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full 
                                     w-5 h-5 flex items-center justify-center text-xs opacity-0 
                                     group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 
                           hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{editingId ? 'Сохранить' : 'Создать'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 
                           px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <X size={16} />
                  <span>Отмена</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Photosets List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Фотосеты ({photosets.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {photosets.map((photoset) => (
              <div key={photoset.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    {photoset.images[0] && (
                      <img
                        src={photoset.images[0]}
                        alt={photoset.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {photoset.title}
                        <span className="ml-2 inline-block bg-gray-100 text-gray-800 
                                       text-xs px-2 py-1 rounded-full">
                          {getCategoryLabel(photoset.category)}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {photoset.location} • {photoset.photographer}
                      </p>
                      <p className="text-sm text-gray-700">{photoset.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {photoset.images.length} изображений
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(photoset)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(photoset.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {photosets.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">Фотосеты пока не добавлены</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotosetsManager;