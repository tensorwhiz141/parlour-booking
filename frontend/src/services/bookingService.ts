/* import api from '../utils/axiosConfig';
import { Booking, ApiResponse } from '../types';

// Get all bookings (for admin)
export const getAllBookings = async (): Promise<ApiResponse<Booking[]>> => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch bookings',
    };
  }
};

// Get bookings for current user
export const getUserBookings = async (): Promise<ApiResponse<Booking[]>> => {
  try {
    const response = await api.get('/bookings/user');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch your bookings',
    };
  }
};

// Create a new booking
export const createBooking = async (bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create booking',
    };
  }
};

// Update booking status (for admin)
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update booking status',
    };
  }
};

// Cancel a booking (for user)
export const cancelBooking = async (bookingId: string): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel booking',
    };
  }
};

// Delete a booking (for admin)
export const deleteBooking = async (bookingId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete booking',
    };
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (date: string, serviceId: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await api.get(`/bookings/available-slots?date=${date}&serviceId=${serviceId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch available time slots',
    };
  }
}; */

import api from '../utils/axiosConfig';
import { Booking, ApiResponse } from '../types';

// Get all bookings (for admin)
export const getAllBookings = async (): Promise<ApiResponse<Booking[]>> => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch bookings',
    };
  }
};

// Get bookings for current user
export const getUserBookings = async (): Promise<ApiResponse<Booking[]>> => {
  try {
    const response = await api.get('/bookings/user');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch your bookings',
    };
  }
};

// Create a new booking
export const createBooking = async (bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create booking',
    };
  }
};

// Update booking status (for admin)
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update booking status',
    };
  }
};

// Cancel a booking (for user)
export const cancelBooking = async (bookingId: string): Promise<ApiResponse<Booking>> => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel booking',
    };
  }
};

// Delete a booking (for admin)
export const deleteBooking = async (bookingId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete booking',
    };
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (date: string, serviceId: string, stylistId?: string): Promise<ApiResponse<string[]>> => {
  try {
    console.log('Sending request to /available-slots with:', { date, serviceId, stylistId });
    const response = await api.get('/bookings/available-slots', {
      params: { date, serviceId, stylistId }
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch available time slots',
    };
  }
};