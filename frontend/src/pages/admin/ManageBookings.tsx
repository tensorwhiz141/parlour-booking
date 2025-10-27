import React, { useState, useEffect } from 'react';
import { Calendar, Search, Check, X, MoreVertical } from 'lucide-react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../../services/bookingService';
import { Booking } from '../../types';
import Swal from 'sweetalert2';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        
        if (response.success && response.data) {
          // Sort bookings by date (newest first)
          const sortedBookings = response.data.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          
          setBookings(sortedBookings);
          setFilteredBookings(sortedBookings);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load bookings',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Apply filters whenever search term, status filter, or date filter changes
  useEffect(() => {
    let result = bookings;
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        booking =>
          booking.userName?.toLowerCase().includes(search) ||
          booking.userEmail?.toLowerCase().includes(search) ||
          booking.serviceName.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.status === filterStatus);
    }
    
    // Apply date filter
    if (filterDate) {
      const selectedDate = new Date(filterDate).toDateString();
      result = result.filter(booking => 
        new Date(booking.date).toDateString() === selectedDate
      );
    }
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterStatus, filterDate, bookings]);

  // Handle status update
  const handleStatusUpdate = async (bookingId: string | undefined, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    if (!bookingId) return;
    
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      
      if (response.success) {
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Booking has been ${newStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: response.error || 'Failed to update booking status',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the booking',
      });
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId: string | undefined) => {
    if (!bookingId) return;
    
    // Confirm before deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This booking will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await deleteBooking(bookingId);
        
        if (response.success) {
          // Update local state
          setBookings(prevBookings => 
            prevBookings.filter(booking => booking._id !== bookingId)
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Booking has been deleted',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: response.error || 'Failed to delete booking',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'An error occurred while deleting the booking',
        });
      }
    }
  };

  // Format date
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <h1 className="text-2xl font-semibold text-gray-800">Manage Bookings</h1>
        <p className="text-gray-600">View and manage all customer appointments</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search by name, email, or service..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{booking.userName}</div>
                      <div className="text-xs text-gray-500">{booking.userEmail}</div>
                      {booking.userPhone && <div className="text-xs text-gray-500">{booking.userPhone}</div>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{booking.serviceName}</div>
                      {booking.stylistName && (
                        <div className="text-xs text-gray-500">with {booking.stylistName}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{formatDate(booking.date)}</div>
                      <div className="text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">₹{booking.price}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                              className="p-1 text-green-600 hover:text-green-800 focus:outline-none"
                              title="Confirm"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                              className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                              title="Cancel"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                            className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                            title="Mark as Completed"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                        
                        <div className="relative inline-block text-left">
                          <button 
                            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => {
                              Swal.fire({
                                title: 'Booking Details',
                                html: `
                                  <div class="text-left">
                                    <p><strong>Client:</strong> ${booking.userName}</p>
                                    <p><strong>Email:</strong> ${booking.userEmail}</p>
                                    ${booking.userPhone ? `<p><strong>Phone:</strong> ${booking.userPhone}</p>` : ''}
                                    <p><strong>Service:</strong> ${booking.serviceName}</p>
                                    ${booking.stylistName ? `<p><strong>Stylist:</strong> ${booking.stylistName}</p>` : ''}
                                    <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                                    <p><strong>Time:</strong> ${booking.time}</p>
                                    <p><strong>Status:</strong> ${booking.status}</p>
                                    <p><strong>Price:</strong> ₹${booking.price}</p>
                                    ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
                                  </div>
                                `,
                                confirmButtonText: 'Close',
                                showCancelButton: true,
                                cancelButtonText: 'Delete Booking',
                                cancelButtonColor: '#d33',
                              }).then((result) => {
                                if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                                  handleDeleteBooking(booking._id);
                                }
                              });
                            }}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                    No bookings found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredBookings.length)}
                </span>{' '}
                of <span className="font-medium">{filteredBookings.length}</span> bookings
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } text-sm font-medium rounded-md`}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } text-sm font-medium rounded-md`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;