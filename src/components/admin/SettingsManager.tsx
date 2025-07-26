import React, { useState, useEffect } from 'react';
import { supabase, Setting } from '../../lib/supabase';
import { uploadFile, validateFile } from '../../lib/storage';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
      
      // Set background image value
      const bgSetting = data?.find(s => s.key === 'background_image');
      if (bgSetting) {
        setBackgroundImage(bgSetting.value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBackgroundImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'background_image',
          value: backgroundImage,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      
      setSuccess('Фоновое изображение успешно обновлено');
      await fetchSettings();
      
      // Reload the page to apply the new background
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const validation = validateFile(file, 'image');
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await uploadFile(file, 'website-images', 'backgrounds');
      if (result.error) {
        throw new Error(result.error);
      }

      setBackgroundImage(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка настроек...</p>
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
                Настройки сайта
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Background Image Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <ImageIcon className="w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Фоновое изображение
            </h2>
          </div>
          
          <form onSubmit={handleSaveBackgroundImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фоновое изображение
              </label>
              
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500">
                  Загрузите изображение (JPEG, PNG, WebP, максимум 10MB) или введите URL
                </p>
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Или введите URL изображения
                </label>
                <input
                  type="url"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="https://example.com/background.jpg"
                />
              </div>
              
              {uploading && (
                <div className="flex items-center space-x-2 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Загрузка изображения...</span>
                </div>
              )}
            </div>
            
            {/* Preview */}
            {backgroundImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Предварительный просмотр
                </label>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={backgroundImage}
                    alt="Предварительный просмотр фона"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving || uploading || !backgroundImage}
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 
                         hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Current Settings Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Текущие настройки
          </h2>
          
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {setting.key === 'background_image' ? 'Фоновое изображение' : setting.key}
                    </h3>
                    <p className="text-sm text-gray-600 break-all">
                      {setting.value}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Обновлено: {new Date(setting.updated_at).toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsManager;