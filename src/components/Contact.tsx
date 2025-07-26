import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Instagram className="w-6 h-6" />,
      title: 'Instagram',
      content: '@sabina.mak',
      link: 'https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Telegram',
      content: 'Sabina_Mak_brand',
      link: 'https://t.me/Sabina_Mak_brand'
    },
  ];

  return (
    <section className="py-20 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-archivo font-black tracking-tight text-white mb-4">
            Свяжитесь с нами
          </h2>
          <div className="w-16 h-px bg-white mx-auto mb-6"></div>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Команда бренда «SABINA MAK» поможет ВАМ произвести ТО САМОЕ впечатление.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-2xl font-light text-white mb-8">Контактная информация</h3>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="text-gray-300">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      {info.title}
                    </h4>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gray-300">{info.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-light text-white mb-4">Подписывайтесь на нас</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 text-white flex items-center justify-center 
                           hover:bg-white/20 transition-colors duration-200"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://t.me/Sabina_Mak_brand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 text-white flex items-center justify-center 
                           hover:bg-white/20 transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M120,0C53.7,0,0,53.7,0,120s53.7,120,120,120s120-53.7,120-120S186.3,0,120,0z M175.8,84.4l-21.5,101.6
    c-1.6,7.1-5.8,8.9-11.7,5.6l-32.4-23.9l-15.6,15c-1.7,1.7-3.1,3.1-6.3,3.1l2.3-32.4l59-53.4c2.6-2.3-0.6-3.6-4-1.3l-73,46
    l-31.4-9.8c-6.8-2.1-6.9-6.8,1.4-10.1l122.9-47.4C172.2,72.7,178.2,76.5,175.8,84.4z"/>
</svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;