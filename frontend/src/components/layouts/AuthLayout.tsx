import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scissors } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isAuthenticated) {
    return <Navigate to={authState.user?.role === 'admin' ? "/admin/dashboard" : "/user/dashboard"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-primary-600 p-4 text-white text-center">
          <div className="flex items-center justify-center mb-2">
            <Scissors className="h-8 w-8 text-secondary-200" />
          </div>
          <h1 className="font-display text-2xl">Ananda Beauty Parlour</h1>
          <p className="text-primary-100 text-sm">Experience True Beauty</p>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;