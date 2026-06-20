import api from './axios';

export async function getNotifications() {
  const response = await api.get('/notifications');
  return response.data;
}

export async function markAsRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllAsRead() {
  const response = await api.patch('/notifications/mark-all-read');
  return response.data;
}
