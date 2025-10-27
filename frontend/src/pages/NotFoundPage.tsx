import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Scissors className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-6xl font-display font-bold text-primary-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;