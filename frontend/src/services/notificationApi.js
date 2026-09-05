import api from './api';

export const notificationApi = {
  // Fetch Inbox Notifications with filtering and pagination
  getInbox: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.unreadOnly) query.append('unreadOnly', 'true');
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return api.get(`/notifications/inbox${queryString}`);
  },

  // Fast Unread Count for badges
  getUnreadCount: async () => {
    return api.get('/notifications/unread-count');
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return api.put('/notifications/read-all');
  },

  // Delete single notification
  deleteNotification: async (id) => {
    return api.delete(`/notifications/${id}`);
  },

  // Clear all notifications
  clearAll: async () => {
    return api.delete('/notifications/clear-all');
  },

  // Dispatch broadcast (Admin only)
  sendBroadcast: async (data) => {
    return api.post('/notifications/broadcast', data);
  },
};

export default notificationApi;
