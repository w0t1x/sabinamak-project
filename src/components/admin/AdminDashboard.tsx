import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Image, 
  Camera, 
  Video,
  Settings,
  LogOut,
  Plus,
  Eye
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const stats = [
    {
      name: 'Коллекции',
      value: '12',
      icon: <Image className="w-8 h-8" />,
      href: '/admin/collections'
    },
    {
      name: 'Фотосеты',
      value: '8',
      icon: <Camera className="w-8 h-8" />,
      href: '/admin/photosets'
    },
    {
      name: 'Видео',
      value: '5',
      icon: <Video className="w-8 h-8" />,
      href: '/admin/videos'
    },
    {
      name: 'Просмотры',
      value: '2.4k',
      icon: <Eye className="w-8 h-8" />,
      href: '#'
    }
  ];

  const quickActions = [
    {
      name: 'Добавить коллекцию',
      description: 'Создать новую коллекцию одежды',
      icon: <Plus className="w-6 h-6" />,
      href: '/admin/collections/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Добавить фотосет',
      description: 'Загрузить новый фотосет',
      icon: <Plus className="w-6 h-6" />,
      href: '/admin/photosets/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Добавить видео',
      description: 'Загрузить новое видео',
      icon: <Plus className="w-6 h-6" />,
      href: '/admin/videos/new',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'Посмотреть сайт',
      description: 'Перейти на публичную версию',
      icon: <Eye className="w-6 h-6" />,
      href: '/',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="w-8 h-8 text-gray-900" />
              <div>
                <h1 className="text-xl font-archivo font-thin tracking-widest text-gray-900">
                  Админ-панель САБИНА МАК
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Добро пожаловать, <span className="font-medium">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 
                         transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Управление контентом
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/collections"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              <Image className="w-6 h-6 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Коллекции</h4>
                <p className="text-sm text-gray-600">Управление коллекциями одежды</p>
              </div>
            </a>
            
            <a
              href="/admin/photosets"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              <Camera className="w-6 h-6 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Фотосеты</h4>
                <p className="text-sm text-gray-600">Управление фотосетами и галереями</p>
              </div>
            </a>
            
            <a
              href="/admin/videos"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              <Video className="w-6 h-6 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Видео</h4>
                <p className="text-sm text-gray-600">Управление видео контентом</p>
              </div>
            </a>
            
            <a
              href="/admin/settings"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              <Settings className="w-6 h-6 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Настройки</h4>
                <p className="text-sm text-gray-600">Настройки сайта и фон</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;