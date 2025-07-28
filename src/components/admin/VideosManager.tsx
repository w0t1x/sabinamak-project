import React, { useState, useEffect } from 'react';
import { supabase, Video } from '../../lib/supabase';
import { uploadFile, validateFile, deleteFile } from '../../lib/storage';
import { Plus, Edit, Trash2, Loader2, Save, X, Play } from 'lucide-react';

const VideosManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caption: '',
    thumbnail: '',
    video_path: '',
    redirect_url: ''
  });

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
      setError(err instanceof Error ? err.message : 'Ошибка загрузки видео');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('videos')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([formData]);
        
        if (error) throw error;
      }

      await fetchVideos();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description,
      caption: video.caption,
      thumbnail: video.thumbnail,
      video_path: video.video_path,
      redirect_url: video.redirect_url
    });
    setEditingId(video.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      caption: '',
      thumbnail: '',
      video_path: '',
      redirect_url: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleVideoUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const validation = validateFile(file, 'video');
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await uploadFile(file, 'website-videos', 'videos');
      if (result.error) {
        throw new Error(result.error);
      }

      setFormData({
        ...formData,
        video_path: result.url
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки видео');
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const validation = validateFile(file, 'image');
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await uploadFile(file, 'website-images', 'thumbnails');
      if (result.error) {
        throw new Error(result.error);
      }

      setFormData({
        ...formData,
        thumbnail: result.url
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки превью');
    } finally {
      setUploading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка видео...</p>
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
                Управление видео
              </h1>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 
                       hover:bg-gray-800 transition-colors duration-200"
            >
              <Plus size={16} />
              <span>Добавить видео</span>
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
              {editingId ? 'Редактировать видео' : 'Добавить видео'}
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
                    Подпись *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                             focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Краткая подпись для видео"
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
                  Видеофайл *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Выберите видеофайл (MP4, WebM, OGG, максимум 200MB)
                </p>
                
                {formData.video_path && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">✓ Видео загружено</p>
                    <video
                      src={formData.video_path}
                      className="w-32 h-20 object-cover rounded border mt-1"
                      muted
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL для перехода при клике *
                </label>
                <input
                  type="url"
                  required
                  value={formData.redirect_url}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="https://www.instagram.com/sabina.mak"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL, на который будет перенаправлен пользователь при клике на видео
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Превью изображение *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Выберите изображение для превью (JPEG, PNG, WebP, максимум 10MB)
                </p>
                
                {formData.thumbnail && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">✓ Превью загружено</p>
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded border mt-1"
                    />
                  </div>
                )}
              </div>
              
              {uploading && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Загрузка файла...</span>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading || !formData.video_path || !formData.thumbnail}
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

        {/* Videos List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Видео ({videos.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {videos.map((video) => (
              <div key={video.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {video.caption}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{video.description}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        Переход: {video.redirect_url}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(video.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {videos.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">Видео пока не добавлены</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideosManager;