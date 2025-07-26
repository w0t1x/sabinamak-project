import React from 'react';
import { Award, Users, Globe, Heart } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Превосходство в дизайне',
      description: 'Признание за инновационный подход к современному модному дизайну'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Глобальное сообщество',
      description: 'Создание связей с любителями моды по всему миру'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Международное присутствие',
      description: 'Представлено на неделях моды и в редакционных публикациях по всему миру'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Устойчивая мода',
      description: 'Приверженность этичному производству и устойчивым практикам'
    }
  ];

  return (
    <section className="py-20 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-archivo font-bold tracking-tight text-white mb-6">
            О бренде САБИНА МАК
          </h2>
          <div className="w-16 h-px bg-white mx-auto mb-8"></div>
          
          <div className="space-y-6 text-gray-300 leading-relaxed max-w-4xl mx-auto">
            <p className="text-lg text-gray-200">
              Команда бренда «САБИНА МАК» поможет ВАМ произвести ТО САМОЕ впечатление.
            </p>
            
            <p>
              «САБИНА МАК» — для тех, кто ценит качество, стремится к гармонии и знает, что настоящая мода начинается с уверенности в себе.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light text-white mb-8 text-center">Наши ценности</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-gray-700 mt-1">
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
