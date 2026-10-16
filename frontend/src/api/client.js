// In production deployment, VITE_API_BASE_URL points to the live backend (e.g. https://api.placementai.com/api)
// In local development or reverse proxy setups, it defaults to '/api'
const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      removeAuthToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (res.status === 429) {
      let retryMsg = 'Too many requests. Please wait a moment before trying again.';
      try {
        const rateData = await res.json();
        if (rateData.detail) {
          retryMsg = rateData.detail;
        }
      } catch (_) {}
      throw new Error(retryMsg);
    }

    if (!res.ok) {
      let errorMsg = `Request failed: ${res.statusText}`;
      try {
        const errData = await res.json();
        if (errData.detail) {
          errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`API Error on [${options.method || 'GET'} ${cleanEndpoint}]:`, err.message);
    }
    throw err;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
