import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, user, loading: authLoading } = useAuth();

  // Redirect if already logged in (all users are admins now)
  React.useEffect(() => {
    if (user) {
      window.location.href = '/admin';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Неверный email или пароль');
        } else {
          setError(`Ошибка входа: ${error.message}`);
        }
        setLoading(false);
      } else {
        // Wait a moment for the auth context to update, then redirect
        setTimeout(() => {
          // The useEffect will handle the redirect once user is loaded
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError(`Произошла ошибка при входе в систему: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      setLoading(false);
    }
  };

  // Show loading while auth context is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-light">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-light text-gray-900">
            Вход в админ-панель
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-archivo font-black tracking-tight">
            САБИНА МАК - Управление контентом
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email адрес
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md 
                           placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 
                           focus:border-gray-900"
                  placeholder="admin@sabina.mak"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md 
                           placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 
                           focus:border-gray-900"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Войти в систему'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              ← Вернуться на сайт
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;