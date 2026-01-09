const API_BASE_URL = 'https://whatsapp-receptionist-backend.onrender.com/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterData) =>
    apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Business
export const businessApi = {
  get: () => apiRequest<{ business: Business }>('/business'),
};

// Services
export const servicesApi = {
  getAll: () => apiRequest<{ services: Service[] }>('/business/services'), // FIXED HERE!
  
  create: (data: Omit<Service, 'id'>) =>
    apiRequest<{ service: Service }>('/business/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Service>) =>
    apiRequest<{ service: Service }>(`/business/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/business/services/${id}`, {
      method: 'DELETE',
    }),
};

// Staff
export const staffApi = {
  getAll: () => apiRequest<{ staff: Staff[] }>('/business/staff'),
  
  create: (data: Omit<Staff, 'id'>) =>
    apiRequest<{ staff: Staff }>('/business/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Staff>) =>
    apiRequest<{ staff: Staff }>(`/business/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/business/staff/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings
export const bookingsApi = {
  getAll: () => apiRequest<{ bookings: Booking[] }>('/bookings'),
  
  updateStatus: (id: string, status: BookingStatus) =>
    apiRequest<{ booking: Booking }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// FAQs
export const faqApi = {
  getAll: () => apiRequest<{ faqs: FAQ[] }>('/faqs'),
  
  create: (data: Omit<FAQ, 'id'>) =>
    apiRequest<{ faq: FAQ }>('/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<FAQ>) =>
    apiRequest<{ faq: FAQ }>(`/faqs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/faqs/${id}`, {
      method: 'DELETE',
    }),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessType: string;
}

export interface Business {
  id: string;
  name: string;
  businessType: string;
  whatsappConnected: boolean;
  monthlyConversations: number;
  conversationLimit: number;
  plan: string;
  services: Service[];
  staff: Staff[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  calendarConnected?: boolean;
}

export interface Booking {
  id: string;
  customer: {
    name: string;
    whatsappNumber: string;
  };
  service: {
    name: string;
  };
  staff: {
    name: string;
  };
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive?: boolean;
}
