import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading, isAdmin } = useAuth();

  console.log('ProtectedRoute - User:', user?.id, 'Loading:', loading, 'IsAdmin:', isAdmin);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-light">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Доступ запрещен
            </h2>
            <p className="text-gray-600 mb-6">
              Для доступа к этой странице необходимо войти в систему.
            </p>
            <a
              href="/admin/login"
              className="inline-block bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 
                       transition-colors duration-200"
            >
              Войти в систему
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Since all authenticated users are now considered admins, we skip the admin check

  return <>{children}</>;
};

export default ProtectedRoute;