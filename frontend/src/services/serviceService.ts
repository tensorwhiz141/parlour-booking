import api from '../utils/axiosConfig';
import { Service, ApiResponse } from '../types';

// Get all services
export const getAllServices = async (): Promise<ApiResponse<Service[]>> => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch services',
    };
  }
};

// Get service by ID
export const getServiceById = async (serviceId: string): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch service details',
    };
  }
};

// Create a new service (admin only)
export const createService = async (serviceData: Service): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create service',
    };
  }
};

// Update a service (admin only)
export const updateService = async (serviceId: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update service',
    };
  }
};

// Delete a service (admin only)
export const deleteService = async (serviceId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete service',
    };
  }
};

// Get services by category
export const getServicesByCategory = async (category: string): Promise<ApiResponse<Service[]>> => {
  try {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch services by category',
    };
  }
};