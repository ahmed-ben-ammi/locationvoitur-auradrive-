import api from './axios';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public endpoint: no auth needed
export const sendContactMessage = async (data) => {
  const response = await axios.post(`${API_URL}/contact`, data);
  return response.data;
};

// Protected endpoints: use authenticated api client
export const getContactMessages = async (status) => {
  const response = await api.get('/contact', {
    params: { status }
  });
  return response.data;
};

export const getContactStats = async () => {
  const response = await api.get('/contact/stats');
  return response.data;
};

export const markMessageRead = async (id) => {
  const response = await api.put(`/contact/${id}/read`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};
