/*
  # Создание Storage buckets для изображений и видео

  1. Buckets
    - `website-images` - для хранения всех изображений (коллекции, фотосеты, превью, фоны)
    - `website-videos` - для хранения видеофайлов

  2. Политики безопасности
    - Публичный доступ на чтение для всех файлов
    - Загрузка файлов только для аутентифицированных пользователей
    - Удаление файлов только для аутентифицированных пользователей

  3. Настройки
    - Публичные buckets для доступа к файлам без авторизации
    - Ограничения по размеру файлов
*/

-- Создаем bucket для изображений
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-images',
  'website-images',
  true,
  10485760, -- 10MB в байтах
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Создаем bucket для видео
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-videos',
  'website-videos',
  true,
  104857600, -- 100MB в байтах
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- Политики для bucket website-images

-- Разрешить всем читать файлы изображений
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'website-images');

-- Разрешить аутентифицированным пользователям загружать изображения
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'website-images');

-- Разрешить аутентифицированным пользователям обновлять изображения
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'website-images')
WITH CHECK (bucket_id = 'website-images');

-- Разрешить аутентифицированным пользователям удалять изображения
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'website-images');

-- Политики для bucket website-videos

-- Разрешить всем читать видеофайлы
CREATE POLICY "Allow public read access to videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'website-videos');

-- Разрешить аутентифицированным пользователям загружать видео
CREATE POLICY "Allow authenticated users to upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'website-videos');

-- Разрешить аутентифицированным пользователям обновлять видео
CREATE POLICY "Allow authenticated users to update videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'website-videos')
WITH CHECK (bucket_id = 'website-videos');

-- Разрешить аутентифицированным пользователям удалять видео
CREATE POLICY "Allow authenticated users to delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'website-videos');