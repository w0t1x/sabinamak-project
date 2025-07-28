import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram } from 'lucide-react';

interface HeaderProps {
  onSectionScroll: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSectionScroll }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'collections', label: 'Коллекции' },
    { id: 'photosets', label: 'Фотосеты' },
    { id: 'videos', label: 'Видео' },
    { id: 'about', label: 'О бренде' },
    { id: 'contact', label: 'Контакты' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'collections', 'photosets', 'videos', 'about', 'contact'];
      const headerHeight = 64;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= headerHeight + 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onSectionScroll(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="text-2xl font-raleway font-thin tracking-widest text-white">
              САБИНА МАК
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-light tracking-wide transition-colors duration-200 pb-1 ${
                  activeSection === item.id
                    ? 'text-white border-b border-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://t.me/Sabina_Mak_brand"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M120,0C53.7,0,0,53.7,0,120s53.7,120,120,120s120-53.7,120-120S186.3,0,120,0z M175.8,84.4l-21.5,101.6
    c-1.6,7.1-5.8,8.9-11.7,5.6l-32.4-23.9l-15.6,15c-1.7,1.7-3.1,3.1-6.3,3.1l2.3-32.4l59-53.4c2.6-2.3-0.6-3.6-4-1.3l-73,46
    l-31.4-9.8c-6.8-2.1-6.9-6.8,1.4-10.1l122.9-47.4C172.2,72.7,178.2,76.5,175.8,84.4z"/>
</svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/70 backdrop-blur-sm shadow-lg">
            <nav className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left text-sm font-light tracking-wide transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-600">
                <a
                  href="https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://t.me/Sabina_Mak_brand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-.962 6.502-.379 1.561-.766 2.165-1.499 2.165-.63 0-1.193-.434-1.193-1.055 0-.216.04-.445.098-.672l.058-.24c.058-.25.12-.5.165-.749.129-.68.257-1.367.385-2.047.101-.534.2-1.068.254-1.597.027-.264.049-.529.049-.793 0-.264-.022-.529-.049-.793-.054-.529-.153-1.063-.254-1.597-.128-.68-.256-1.367-.385-2.047-.045-.249-.107-.499-.165-.749l-.058-.24c-.058-.227-.098-.456-.098-.672 0-.621.563-1.055 1.193-1.055.733 0 1.12.604 1.499 2.165 0 0 .782-4.604.962-6.502.016-.166-.004-.379-.02-.472a.506.506 0 0 0-.171-.325c-.144-.117-.365-.142-.465-.14z"/>
                  </svg>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;