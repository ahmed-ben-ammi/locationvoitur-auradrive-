const AUTH_STORAGE_KEY = 'drivecargo_auth';

export function getAuthData() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Unable to parse auth data from localStorage:', error);
    return null;
  }
}

export function saveAuthData({ token, user }) {
  if (!token || !user) return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken() {
  const auth = getAuthData();
  return auth?.token || null;
}

export function getAuthUser() {
  const auth = getAuthData();
  return auth?.user || null;
}
