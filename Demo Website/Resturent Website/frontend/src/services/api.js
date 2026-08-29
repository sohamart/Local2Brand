let rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
if (rawBase.startsWith('VITE_API_BASE_URL=')) {
  rawBase = rawBase.replace(/^VITE_API_BASE_URL=\s*/, '');
}
const API_BASE = rawBase.replace(/\/+$/, '');

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lamour_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: data }),

  // Menu
  getMenu: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/menu${query ? `?${query}` : ''}`);
  },
  addMenuItem: (item) => request('/menu', { method: 'POST', body: item }),
  updateMenuItem: (id, item) => request(`/menu/${id}`, { method: 'PUT', body: item }),
  toggleItemAvailability: (id) => request(`/menu/${id}/availability`, { method: 'PATCH' }),
  deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: orderData }),
  trackOrder: (orderId) => request(`/orders/track/${orderId}`),
  getMyOrders: () => request('/orders/my-orders'),
  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders/admin/all${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, statusData) => request(`/orders/admin/${id}/status`, { method: 'PATCH', body: statusData }),

  // Delivery Partner / Rider APIs
  getDriverAvailableOrders: () => request('/orders/driver/available'),
  getDriverActiveOrders: () => request('/orders/driver/my-active'),
  getDriverHistory: () => request('/orders/driver/history'),
  acceptDriverOrder: (id, vehicle) => request(`/orders/driver/${id}/accept`, { method: 'POST', body: { vehicle } }),
  updateDriverOrderStatus: (id, payload) => request(`/orders/driver/${id}/status`, { method: 'PATCH', body: payload }),
  updateDriverLocation: (lat, lng) => request('/orders/driver/location', { method: 'POST', body: { lat, lng } }),

  // Razorpay
  getRazorpayConfig: () => request('/razorpay/config'),
  createRazorpayOrder: (orderPayload) => request('/razorpay/create-order', { method: 'POST', body: orderPayload }),
  verifyRazorpayPayment: (verifyPayload) => request('/razorpay/verify-payment', { method: 'POST', body: verifyPayload }),

  // Reservations
  createReservation: (data) => request('/reservations', { method: 'POST', body: data }),
  getAdminReservations: () => request('/reservations/admin/all'),
  updateReservationStatus: (id, status) => request(`/reservations/admin/${id}/status`, { method: 'PATCH', body: { status } }),

  // Reviews
  getReviews: () => request('/reviews'),
  submitReview: (data) => request('/reviews', { method: 'POST', body: data }),
  getAdminReviews: () => request('/reviews/admin/all'),
  moderateReview: (id, status) => request(`/reviews/admin/${id}/status`, { method: 'PATCH', body: { status } }),
  deleteReview: (id) => request(`/reviews/admin/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request('/settings'),
  getAdminSettings: () => request('/settings/admin'),
  updateSettings: (settings) => request('/settings/admin', { method: 'PUT', body: settings }),
  sendTestEmail: (target_email) => request('/settings/admin/test-email', { method: 'POST', body: { target_email } }),

  // Newsletter
  subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
  getNewsletterSubscribers: () => request('/newsletter/admin/all'),

  // Analytics & Visits
  recordVisit: (data) => request('/analytics/visit', { method: 'POST', body: data }),
  getAnalyticsOverview: () => request('/analytics/admin/overview'),

  // Users & Riders Directory (Admin)
  getUsersDirectory: () => request('/users/admin/all'),
  getRidersDirectory: () => request('/users/admin/riders'),
  createRider: (riderData) => request('/users/admin/create-rider', { method: 'POST', body: riderData }),
  deleteRider: (id) => request(`/users/admin/rider/${id}`, { method: 'DELETE' }),

  // Image Upload
  uploadImage: async (file) => {
    const token = localStorage.getItem('lamour_token');
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload image');
    return data;
  }
};
