// User types
export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Service types
export interface Service {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  category?: string;
}

// Stylist types
export interface Stylist {
  _id?: string;
  name: string;
  specialization: string[];
  experience: number; // in years
  rating?: number;
  image?: string;
  availability?: string[];
}

// Booking types
export interface Booking {
  _id?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  serviceId?: string;
  serviceName: string;
  stylistId?: string;
  stylistName?: string;
  date: Date | string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  specialRequests?: string;
  createdAt?: Date;
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
}