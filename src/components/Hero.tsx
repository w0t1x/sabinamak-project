import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative h-screen flex items-center justify-center pt-16 bg-black/30">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-archivo font-bold tracking-tight text-white mb-4 relative z-10">
            САБИНА МАК
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-8 relative z-10"></div>
          <p className="text-xl md:text-2xl font-light text-white tracking-wide relative z-10">
            Современная мода и редакционная фотография
          </p>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg font-light text-white/90 max-w-2xl mx-auto leading-relaxed relative z-10">
            Всем привет! Стиль - это образ жизни. Главное - не количество вещей, а их качество!
            Философия моего бренда «SABINA MAK - это стиль»
          </p>
          
          <button
            onClick={onExplore}
            className="group inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-3 
                     hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 relative z-10"
          >
            <span className="font-light tracking-wide">Посмотреть коллекции</span>
            <ArrowDown 
              size={16} 
              className="group-hover:translate-y-1 transition-transform duration-300" 
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;