import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  bucket: 'website-images' | 'website-videos',
  folder?: string
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      if (error.message.includes('Bucket not found')) {
        return { 
          url: '', 
          path: '', 
          error: `Хранилище "${bucket}" не найдено. Создайте bucket "${bucket}" в панели Supabase Storage.`
        };
      }
      if (error.message.includes('timeout') || error.message.includes('Gateway')) {
        return { 
          url: '', 
          path: '', 
          error: 'Превышено время ожидания. Проверьте подключение к интернету и повторите попытку.'
        };
      }
      return { url: '', path: '', error: `Ошибка загрузки: ${error.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (err) {
    console.error('Upload error:', err);
    if (err instanceof Error) {
      if (err.message.includes('timeout') || err.message.includes('Gateway')) {
        return { 
          url: '', 
          path: '', 
          error: 'Превышено время ожидания. Проверьте подключение к интернету и повторите попытку.'
        };
      }
      if (err.message.includes('JSON') || err.message.includes('Unexpected token')) {
        return { 
          url: '', 
          path: '', 
          error: 'Ошибка связи с сервером. Проверьте настройки Supabase и повторите попытку.'
        };
      }
    }
    return { 
      url: '', 
      path: '', 
      error: err instanceof Error ? `Ошибка загрузки: ${err.message}` : 'Неизвестная ошибка загрузки'
    };
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  bucket: 'website-images' | 'website-videos',
  path: string
): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return {};
  } catch (err) {
    console.error('Delete error:', err);
    return { 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
};

/**
 * Get public URL for a file in storage
 */
export const getPublicUrl = (
  bucket: 'website-images' | 'website-videos',
  path: string
): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Validate file type and size
 */
export const validateFile = (
  file: File,
  type: 'image' | 'video'
): { valid: boolean; error?: string } => {
  const maxSizes = {
    image: 10 * 1024 * 1024, // 10MB
    video: 50 * 1024 * 1024   // 50MB
  };

  const allowedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg']
  };

  if (file.size > maxSizes[type]) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимальный размер: ${type === 'image' ? '10MB' : '50MB'}`
    };
  }

  if (!allowedTypes[type].includes(file.type)) {
    return {
      valid: false,
      error: `Неподдерживаемый тип файла. Разрешены: ${allowedTypes[type].join(', ')}`
    };
  }

  return { valid: true };
};