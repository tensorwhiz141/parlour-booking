// import api from '../utils/axiosConfig';
// import { User, ApiResponse } from '../types';

// // Register a new user
// export const registerUser = async (userData: User): Promise<ApiResponse<User>> => {
//   try {
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.response?.data?.message || 'Failed to register user',
//     };
//   }
// };

// // Login user
// export const loginUser = async (email: string, password: string): Promise<ApiResponse<User>> => {
//   try {
//     const response = await api.post('/auth/login', { email, password });
    
//     // Save token and user to local storage
//     if (response.data.success && response.data.token) {
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.data));
//     }
    
//     return response.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.response?.data?.message || 'Failed to login',
//     };
//   }
// };

// // Logout user
// export const logoutUser = (): void => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };

// // Get current user
// export const getCurrentUser = (): User | null => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

// // Get user profile
// export const getUserProfile = async (): Promise<ApiResponse<User>> => {
//   try {
//     const response = await api.get('/users/profile');
//     return response.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.response?.data?.message || 'Failed to get user profile',
//     };
//   }
// };

// // Update user profile
// export const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
//   try {
//     const response = await api.put('/users/profile', userData);
    
//     // Update stored user data
//     if (response.data.success && response.data.data) {
//       const currentUser = getCurrentUser();
//       localStorage.setItem('user', JSON.stringify({
//         ...currentUser,
//         ...response.data.data,
//       }));
//     }
    
//     return response.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.response?.data?.message || 'Failed to update user profile',
//     };
//   }
// };


import api from '../utils/axiosConfig';
import { User, ApiResponse } from '../types';

// Register a new user
export const registerUser = async (userData: User): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register user',
    };
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to login',
    };
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get user profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get user profile',
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put('/users/profile', userData);
    
    // Update stored user data
    if (response.data.success && response.data.data) {
      const currentUser = getCurrentUser();
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data.data,
      }));
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update user profile',
    };
  }
};