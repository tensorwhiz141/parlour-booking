import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../ui/AdminSidebar';
import AdminHeader from '../ui/AdminHeader';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        
        {/* <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6"> */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;