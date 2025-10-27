import React from 'react';
import { useAuth } from '../../context/AuthContext';
// import { Menu, Bell } from 'lucide-react';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const { authState } = useAuth();
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <button
          onClick={toggleSidebar}
          className="block md:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center ml-auto">
          {/* <div className="relative">
            <button className="p-1 text-gray-500 hover:text-primary-600 focus:outline-none">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div> */}
          
          <div className="ml-4 flex items-center">
            <div className="bg-primary-100 h-8 w-8 rounded-full flex items-center justify-center text-primary-800 font-medium">
              {authState.user?.name.charAt(0)}
            </div>
            <span className="ml-2 font-medium text-gray-700 hidden sm:block">
              {authState.user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;