import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserBookings } from '../../services/bookingService';
import { Booking } from '../../types';
import Swal from 'sweetalert2';

const UserDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        if (response.success && response.data) {
          setBookings(response.data);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch your bookings',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-primary-700 text-white rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {authState.user?.name}!</h1>
        <p className="mt-2 text-primary-100">
          Manage your appointments and bookings from your personal dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/user/booking" 
              className="flex items-center justify-between w-full px-4 py-3 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
            >
              <span className="font-medium">Book New Appointment</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/services" 
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Browse Services</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Contact Us</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Upcoming Appointments</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your appointments...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-600 mb-4">You don't have any appointments yet</p>
              <Link 
                to="/user/booking" 
                className="inline-block px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings
                .filter(booking => booking.status !== 'cancelled' && booking.status !== 'completed')
                .slice(0, 3)
                .map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{booking.serviceName}</h3>
                        <p className="text-sm text-gray-600">with {booking.stylistName || 'Any Available Stylist'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(booking.date)}
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      {booking.time}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-medium text-primary-700">₹{booking.price}</span>
                      {booking.status === 'pending' && (
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              
              {bookings.filter(booking => booking.status !== 'cancelled' && booking.status !== 'completed').length > 3 && (
                <Link 
                  to="/user/appointments" 
                  className="block text-center text-primary-600 hover:text-primary-800 font-medium"
                >
                  View All Appointments
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking History</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled').length === 0 ? (
          <p className="text-gray-600 text-center py-4">No past appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings
                  .filter(booking => booking.status === 'completed' || booking.status === 'cancelled')
                  .map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{booking.serviceName}</div>
                        <div className="text-xs text-gray-500">{booking.stylistName || 'Any Available Stylist'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">{formatDate(booking.date)}</div>
                        <div className="text-xs text-gray-500">{booking.time}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">₹{booking.price}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;