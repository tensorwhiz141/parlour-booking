// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// // Layouts
// import MainLayout from './components/layouts/MainLayout';
// import AuthLayout from './components/layouts/AuthLayout';
// import AdminLayout from './components/layouts/AdminLayout';

// // Pages
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import UserDashboard from './pages/user/UserDashboard';
// import BookingPage from './pages/user/BookingPage';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManageBookings from './pages/admin/ManageBookings';
// import ManageServices from './pages/admin/ManageServices';
// import ManageStylists from './pages/admin/ManageStylists';
// import NotFoundPage from './pages/NotFoundPage';

// // Protected route components
// const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
//   const { authState } = useAuth();
  
//   if (authState.loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }
  
//   return authState.isAuthenticated ? element : <Navigate to="/login" />;
// };

// const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
//   const { authState } = useAuth();
  
//   if (authState.loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }
  
//   return authState.isAuthenticated && authState.user?.role === 'admin' 
//     ? element 
//     : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<HomePage />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </Route>

//       {/* Auth Routes */}
//       <Route path="/" element={<AuthLayout />}>
//         <Route path="login" element={<LoginPage />} />
//         <Route path="register" element={<RegisterPage />} />
//       </Route>

//       {/* User Routes */}
//       <Route path="/user" element={<ProtectedRoute element={<MainLayout />} />}>
//         <Route path="dashboard" element={<UserDashboard />} />
//         <Route path="booking" element={<BookingPage />} />
//       </Route>

//       {/* Admin Routes */}
//       <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="bookings" element={<ManageBookings />} />
//         <Route path="services" element={<ManageServices />} />
//         <Route path="stylists" element={<ManageStylists />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;



import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import StylistsPage from './pages/StylistsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import BookingPage from './pages/user/BookingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageServices from './pages/admin/ManageServices';
import ManageStylists from './pages/admin/ManageStylists';
import NotFoundPage from './pages/NotFoundPage';

// Protected route components
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return authState.isAuthenticated ? element : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return authState.isAuthenticated && authState.user?.role === 'admin' 
    ? element 
    : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="stylists" element={<StylistsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* User Routes */}
      <Route path="/user" element={<ProtectedRoute element={<MainLayout />} />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="booking" element={<BookingPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="stylists" element={<ManageStylists />} />
      </Route>
    </Routes>
  );
}

export default App;