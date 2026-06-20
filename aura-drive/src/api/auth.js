import api from './axios';

export async function login({ CNE, password }) {
  const response = await api.post('/auth/login', { CNE, password });
  return response.data;
}

export async function register({ name, CNE, password, phone }) {
  const response = await api.post('/auth/register', { name, CNE, password, phone });
  return response.data;
}

export async function registerAdmin({ name, cne, password, phone, secretKey }) {
  const response = await api.post('/auth/register-admin', { 
    name, 
    CNE: cne, 
    password, 
    phone, 
    secretKey 
  });
  return response.data;
}
