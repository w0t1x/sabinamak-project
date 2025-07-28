import React from 'react';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import CollectionsManager from './components/admin/CollectionsManager';
import PhotosetsManager from './components/admin/PhotosetsManager';
import VideosManager from './components/admin/VideosManager';
import SettingsManager from './components/admin/SettingsManager';
import Header from './components/Header';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Photosets from './components/Photosets';
import Videos from './components/Videos';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';

function App() {
  const [backgroundImage, setBackgroundImage] = useState('https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920');

  useEffect(() => {
    fetchBackgroundImage();
  }, []);

  const fetchBackgroundImage = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'background_image')
        .single();

      if (error) throw error;
      if (data?.value) {
        setBackgroundImage(data.value);
      }
    } catch (err) {
      console.error('Error fetching background image:', err);
    }
  };

  // Simple routing based on pathname
  const pathname = window.location.pathname;

  // Admin routes
  if (pathname === '/admin/login') {
    return (
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    );
  }

  if (pathname === '/admin') {
    return (
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  if (pathname === '/admin/collections') {
    return (
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <CollectionsManager />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  if (pathname === '/admin/photosets') {
    return (
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <PhotosetsManager />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  if (pathname === '/admin/videos') {
    return (
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <VideosManager />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  if (pathname === '/admin/settings') {
    return (
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <SettingsManager />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  // Main website
  const handleSectionScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // Height of fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleExplore = () => {
    handleSectionScroll('collections');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white relative">
        {/* Fixed Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-top bg-no-repeat z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Content that scrolls over background */}
        <div className="relative z-10 bg-transparent">
        <Header onSectionScroll={handleSectionScroll} />
        <main>
          <div id="home">
            <Hero onExplore={handleExplore} />
          </div>
          <div id="collections">
            <Collections />
          </div>
          <div id="photosets">
            <Photosets />
          </div>
          <div id="videos">
            <Videos />
          </div>
          <div id="about">
            <About />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
      </div>
    </AuthProvider>
  );
}

export default App;