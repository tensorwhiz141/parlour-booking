import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Scissors, IndianRupee, TrendingUp, Clock } from 'lucide-react';
import { getAllBookings } from '../../services/bookingService';
import { getAllServices } from '../../services/serviceService';
import { getAllStylists } from '../../services/stylistService';
import { Booking, Service, Stylist } from '../../types';
import Swal from 'sweetalert2';

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConfirmedBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    serviceBreakdown: [] as {serviceName: string, count: number, revenue: number}[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes, stylistsRes] = await Promise.all([
          getAllBookings(),
          getAllServices(),
          getAllStylists()
        ]);
        
        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data);
        }
        
        if (servicesRes.success && servicesRes.data) {
          setServices(servicesRes.data);
        }
        
        if (stylistsRes.success && stylistsRes.data) {
          setStylists(stylistsRes.data);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard data',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate statistics when bookings or services change
  useEffect(() => {
    if (bookings.length > 0 && services.length > 0) {
      // Calculate various statistics
      // const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
      const confirmed = bookings.filter(b => b.status === 'completed');
      const pending = bookings.filter(b => b.status === 'pending');
      const totalRevenue = confirmed.reduce((sum, booking) => sum + booking.price, 0);
      
      // Service breakdown
      const serviceBreakdown = services.map(service => {
        const serviceBookings = bookings.filter(b => 
          (b.status === 'confirmed' || b.status === 'completed') && 
          b.serviceName === service.name
        );
        
        return {
          serviceName: service.name,
          count: serviceBookings.length,
          revenue: serviceBookings.reduce((sum, b) => sum + b.price, 0)
        };
      }).sort((a, b) => b.count - a.count);
      
      setStats({
        totalConfirmedBookings: confirmed.length,
        totalRevenue,
        pendingBookings: pending.length,
        serviceBreakdown
      });
    }
  }, [bookings, services]);

  // Format date function
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of parlour bookings and activities</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            <span>From completed bookings</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmed Bookings</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalConfirmedBookings}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total completed & confirmed
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pendingBookings}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600">
            Needs confirmation
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Stylists</p>
              <h3 className="text-2xl font-bold text-gray-800">{stylists.length}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Team members available
          </div>
        </div>
      </div>
      
      {/* Services Breakdown & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Services Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Services Breakdown</h2>
          
          <div className="space-y-4">
            {stats.serviceBreakdown.slice(0, 5).map((service, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{service.serviceName}</span>
                  <span className="text-sm text-gray-500">{service.count} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (service.count / Math.max(...stats.serviceBreakdown.map(s => s.count))) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Revenue: ₹{service.revenue.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          
          <Link 
            to="/admin/services" 
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            View All Services
          </Link>
        </div>
        
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            <Link 
              to="/admin/bookings" 
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800">{booking.userName}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{booking.serviceName}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {formatDate(booking.date)} - {booking.time}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
          <h3 className="font-semibold text-primary-800 mb-3">Manage Bookings</h3>
          <p className="text-primary-600 text-sm mb-4">
            View, confirm, or cancel upcoming appointments
          </p>
          <Link 
            to="/admin/bookings" 
            className="inline-block px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Bookings
          </Link>
        </div>
        
        <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-100">
          <h3 className="font-semibold text-secondary-800 mb-3">Manage Services</h3>
          <p className="text-secondary-600 text-sm mb-4">
            Add new services or update existing ones
          </p>
          <Link 
            to="/admin/services" 
            className="inline-block px-4 py-2 bg-secondary-500 text-white font-medium rounded-md hover:bg-secondary-600 transition-colors"
          >
            Go to Services
          </Link>
        </div>
        
        <div className="bg-accent-50 p-6 rounded-lg border border-accent-100">
          <h3 className="font-semibold text-accent-800 mb-3">Manage Stylists</h3>
          <p className="text-accent-600 text-sm mb-4">
            Add or update stylist information
          </p>
          <Link 
            to="/admin/stylists" 
            className="inline-block px-4 py-2 bg-accent-600 text-white font-medium rounded-md hover:bg-accent-700 transition-colors"
          >
            Go to Stylists
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;