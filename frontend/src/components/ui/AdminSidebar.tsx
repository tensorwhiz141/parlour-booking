import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Scissors,
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  Users, 
  LogOut, 
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between h-16 px-4 bg-primary-900">
        <Link to="/admin/dashboard" className="flex items-center text-white">
          <Scissors className="h-6 w-6 text-secondary-300" />
          <span className="ml-2 font-display text-lg font-medium">Ananda Admin</span>
        </Link>
        <button 
          onClick={toggleSidebar}
          className="block md:hidden text-primary-100 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="px-2 py-4">
        <nav className="space-y-1">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/dashboard')
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-700 hover:text-white'
            } transition-colors`}
            onClick={() => toggleSidebar()}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          
          <Link
            to="/admin/bookings"
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/bookings')
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-700 hover:text-white'
            } transition-colors`}
            onClick={() => toggleSidebar()}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Manage Bookings
          </Link>
          
          <Link
            to="/admin/services"
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/services')
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-700 hover:text-white'
            } transition-colors`}
            onClick={() => toggleSidebar()}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Manage Services
          </Link>
          
          <Link
            to="/admin/stylists"
            className={`flex items-center px-4 py-3 rounded-md ${
              isActive('/admin/stylists')
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-700 hover:text-white'
            } transition-colors`}
            onClick={() => toggleSidebar()}
          >
            <Users className="h-5 w-5 mr-3" />
            Manage Stylists
          </Link>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-primary-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-primary-100 hover:text-white hover:bg-primary-700 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;