import api from './axios';

export async function getUsers() {
  const response = await api.get('/users');
  return response.data;
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data) {
  const response = await api.post('/users', data);
  return response.data;
}

export async function updateUser(id, data) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

export async function getProfile() {
  const response = await api.get('/users/profile');
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put('/users/profile', data);
  return response.data;
}
