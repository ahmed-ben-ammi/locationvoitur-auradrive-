import api from './axios';

// Note: getDashboardStats and getContactMessages are not used right now,
// but let's keep them for future use

export async function getAllUsers() {
  const response = await api.get('/users');
  return response.data;
}
