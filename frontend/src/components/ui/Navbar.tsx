import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scissors className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-display font-medium text-primary-800">Ananda Beauty</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">Services</Link>
            <Link to="/stylists" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">Stylists</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium">Contact</Link>
            
            {authState.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
                >
                  <span className="mr-1">{authState.user?.name.split(' ')[0]}</span>
                  <User className="h-5 w-5" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    {authState.user?.role === 'admin' ? (
                      <Link 
                        to="/admin/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link 
                        to="/user/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      >
                        My Dashboard
                      </Link>
                    )}
                    
                    {authState.user?.role !== 'admin' && (
                      <Link 
                        to="/user/booking" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      >
                        Book Appointment
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-primary-600 font-medium rounded-md hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/stylists" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Stylists
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {authState.isAuthenticated ? (
              <>
                {authState.user?.role === 'admin' ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/user/dashboard" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link 
                      to="/user/booking" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2 px-3 pb-3">
                <Link 
                  to="/login" 
                  className="w-full px-4 py-2 text-center text-primary-600 border border-primary-600 font-medium rounded-md hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full px-4 py-2 text-center bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;