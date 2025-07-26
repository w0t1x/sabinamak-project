import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Collection {
  id: string;
  title: string;
  description: string;
  season: string;
  images: string[];
  featured: boolean;
  created_at: string;
}

export interface Photoset {
  id: string;
  title: string;
  description: string;
  location: string;
  photographer: string;
  images: string[];
  category: 'editorial' | 'campaign' | 'lookbook';
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  caption: string;
  thumbnail: string;
  video_path: string;
  redirect_url: string;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}