import api from '../utils/axiosConfig';
import { Stylist, ApiResponse } from '../types';

// Get all stylists
export const getAllStylists = async (): Promise<ApiResponse<Stylist[]>> => {
  try {
    const response = await api.get('/stylists');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch stylists',
    };
  }
};

// Get stylist by ID
export const getStylistById = async (stylistId: string): Promise<ApiResponse<Stylist>> => {
  try {
    const response = await api.get(`/stylists/${stylistId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch stylist details',
    };
  }
};

// Create a new stylist (admin only)
export const createStylist = async (stylistData: Stylist): Promise<ApiResponse<Stylist>> => {
  try {
    const response = await api.post('/stylists', stylistData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create stylist',
    };
  }
};

// Update a stylist (admin only)
export const updateStylist = async (stylistId: string, stylistData: Partial<Stylist>): Promise<ApiResponse<Stylist>> => {
  try {
    const response = await api.put(`/stylists/${stylistId}`, stylistData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update stylist',
    };
  }
};

// Delete a stylist (admin only)
export const deleteStylist = async (stylistId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/stylists/${stylistId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete stylist',
    };
  }
};

// Get stylists by specialization
export const getStylistsBySpecialization = async (specialization: string): Promise<ApiResponse<Stylist[]>> => {
  try {
    const response = await api.get(`/stylists/specialization/${specialization}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch stylists by specialization',
    };
  }
};