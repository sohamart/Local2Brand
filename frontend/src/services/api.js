const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    // If running in production on Vercel (e.g. local2brand.vercel.app or custom domain)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      if (envUrl && !envUrl.includes('localhost')) {
        return envUrl;
      }
      return `${window.location.origin}/api`;
    }
  }
  return envUrl || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('l2b_auth_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('l2b_auth_token', token);
    } else {
      localStorage.removeItem('l2b_auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers = {
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const isLongRunning = endpoint.includes('/chat') || endpoint.includes('broadcast') || endpoint.includes('email');
    const timeoutDuration = options.timeout || (isLongRunning ? 60000 : 15000);
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const config = {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    };

    try {
      const res = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error = new Error(data.message || `Request failed with status ${res.status}`);
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err.message);
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('file', file);
    return this.post('/upload', formData);
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
