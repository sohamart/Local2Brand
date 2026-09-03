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
    const timeoutDuration = options.timeout || (isLongRunning ? 60000 : 30000);
    const timeoutId = setTimeout(() => {
      try {
        controller.abort(new Error('Network request timed out. Please check your connection.'));
      } catch (e) {
        controller.abort();
      }
    }, timeoutDuration);

    const config = {
      ...options,
      headers,
      credentials: 'include',
      signal: options.signal || controller.signal,
    };

    try {
      const res = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Only clear auth token if confirmed authentication invalidity from /auth/me or explicit isAuthError
        const isAuthCheckEndpoint = endpoint === '/auth/me' || endpoint.startsWith('/auth/me');
        const isExplicitAuthFailure = data.isAuthError === true || (res.status === 401 && isAuthCheckEndpoint);

        if (isExplicitAuthFailure && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('l2b_cached_user');
          }
        }

        const error = new Error(data.message || `Request failed with status ${res.status}`);
        error.status = res.status;
        error.data = data;
        error.isAuthError = isExplicitAuthFailure;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        const timeoutErr = new Error('Request timed out or was interrupted. Please retry.');
        timeoutErr.status = 408;
        throw timeoutErr;
      }
      console.warn(`API [${options.method || 'GET'}] ${endpoint} notice:`, err.message);
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

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
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
