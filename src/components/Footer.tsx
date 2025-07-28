import React from 'react';
import { Instagram, MessageCircle, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const handleSectionScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-black/70 backdrop-blur-sm text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-raleway font-thin tracking-widest mb-4">САБИНА МАК</h3>
            <p className="text-gray-300 font-light leading-relaxed">
              «САБИНА МАК» — для тех, кто ценит качество, стремится к гармонии и знает, что настоящая мода начинается с уверенности в себе.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-light text-white mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => handleSectionScroll('collections')}
                  className="hover:text-white transition-colors duration-200"
                >
                  Коллекции
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll('photosets')}
                  className="hover:text-white transition-colors duration-200"
                >
                  Фотосеты
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll('videos')}
                  className="hover:text-white transition-colors duration-200"
                >
                  Видео
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll('about')}
                  className="hover:text-white transition-colors duration-200"
                >
                  О бренде
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll('contact')}
                  className="hover:text-white transition-colors duration-200"
                >
                  Контакты
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-light text-white mb-4">Связаться</h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center 
                         transition-colors duration-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://t.me/Sabina_Mak_brand"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center 
                         transition-colors duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M120,0C53.7,0,0,53.7,0,120s53.7,120,120,120s120-53.7,120-120S186.3,0,120,0z M175.8,84.4l-21.5,101.6
    c-1.6,7.1-5.8,8.9-11.7,5.6l-32.4-23.9l-15.6,15c-1.7,1.7-3.1,3.1-6.3,3.1l2.3-32.4l59-53.4c2.6-2.3-0.6-3.6-4-1.3l-73,46
    l-31.4-9.8c-6.8-2.1-6.9-6.8,1.4-10.1l122.9-47.4C172.2,72.7,178.2,76.5,175.8,84.4z"/>
</svg>
              </a>
            </div>
            <p className="text-gray-300 text-sm font-light">
              Стиль - это образ жизни. Главное - не количество вещей, а их качество!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm font-light">
              © 2024 sabina.mak. Все права защищены.
              © 2024 SABINA MAK. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                Условия обслуживания
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;