/*
  # Create collections and photosets tables

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `season` (text)
      - `images` (text array)
      - `featured` (boolean)
      - `created_at` (timestamp)
    - `photosets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `photographer` (text)
      - `images` (text array)
      - `category` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  season text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create photosets table
CREATE TABLE IF NOT EXISTS photosets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  photographer text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('editorial', 'campaign', 'lookbook')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE photosets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to collections"
  ON collections
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to photosets"
  ON photosets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample collections data
INSERT INTO collections (title, description, season, images, featured) VALUES
(
  'Эфирный минимализм',
  'Коллекция, исследующая красоту простоты через чистые линии, нейтральные тона и архитектурные силуэты.',
  'Весна/Лето 2024',
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  true
),
(
  'Городская изысканность',
  'Современные вещи, созданные для современной женщины, которая легко переходит от деловых встреч к светским мероприятиям.',
  'Осень/Зима 2024',
  ARRAY[
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  false
),
(
  'Авангардные выражения',
  'Смелые экспериментальные дизайны, которые бросают вызов традиционным границам моды, сохраняя при этом носимую элегантность.',
  'Курорт 2024',
  ARRAY[
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  true
);

-- Insert sample photosets data
INSERT INTO photosets (title, description, location, photographer, category, images) VALUES
(
  'Мечты мегаполиса',
  'Редакционная серия, запечатлевшая суть городской изысканности на фоне городской архитектуры.',
  'Нью-Йорк',
  'Александра Чен',
  'editorial',
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
),
(
  'Минималистская элегантность',
  'Чистая, современная кампания, демонстрирующая красоту простоты в модной фотографии.',
  'Студия',
  'Маркус Родригес',
  'campaign',
  ARRAY[
    'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
),
(
  'Сезонные переходы',
  'Серия лукбуков, документирующая переход между сезонами через тщательно подобранный стайлинг.',
  'Милан',
  'София Андерссон',
  'lookbook',
  ARRAY[
    'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
),
(
  'Авангардные видения',
  'Экспериментальная редакционная работа, раздвигающая границы модной фотографии и творческого самовыражения.',
  'Париж',
  'Жан-Люк Моро',
  'editorial',
  ARRAY[
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
);