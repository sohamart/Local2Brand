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

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const isUpload = endpoint.includes('/upload');
    const isLongRunning = endpoint.includes('/chat') || endpoint.includes('broadcast') || endpoint.includes('email');
    const timeoutDuration = options.timeout || (isUpload ? 15 * 60 * 1000 : isLongRunning ? 60000 : 30000);
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
        // Only clear auth token if confirmed authentication invalidity explicitly from /auth/me with isAuthError
        const isAuthCheckEndpoint = endpoint === '/auth/me' || endpoint.startsWith('/auth/me');
        const isExplicitAuthFailure = res.status === 401 && isAuthCheckEndpoint && (data.isAuthError === true || data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('session'));

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
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  delete(endpoint, bodyOrOptions = {}) {
    let finalBody = undefined;
    let finalOptions = {};
    if (bodyOrOptions && (bodyOrOptions.headers || bodyOrOptions.signal || bodyOrOptions.timeout)) {
      finalOptions = bodyOrOptions;
    } else if (bodyOrOptions && typeof bodyOrOptions === 'object' && Object.keys(bodyOrOptions).length > 0) {
      finalBody = bodyOrOptions instanceof FormData ? bodyOrOptions : JSON.stringify(bodyOrOptions);
    }
    return this.request(endpoint, { ...finalOptions, method: 'DELETE', body: finalBody });
  }

  uploadWithProgress(endpoint, formData, onProgress, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const token = this.getToken();
      const xhr = new XMLHttpRequest();

      xhr.open(options.method || 'POST', url, true);
      xhr.withCredentials = true;

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (options.headers) {
        Object.entries(options.headers).forEach(([k, v]) => {
          xhr.setRequestHeader(k, v);
        });
      }

      if (xhr.upload && typeof onProgress === 'function') {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const loaded = event.loaded;
            const total = event.total;
            const percent = Math.min(100, Math.round((loaded * 100) / total));
            const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
            const totalMB = (total / (1024 * 1024)).toFixed(1);
            onProgress({
              loaded,
              total,
              percent,
              loadedMB,
              totalMB,
            });
          }
        };
      }

      xhr.onload = () => {
        let responseData = {};
        try {
          responseData = JSON.parse(xhr.responseText || '{}');
        } catch (e) {
          responseData = { raw: xhr.responseText };
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(responseData);
        } else {
          const error = new Error(responseData.message || `Upload failed with status ${xhr.status}`);
          error.status = xhr.status;
          error.data = responseData;
          reject(error);
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload. Please check your internet connection.'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Upload timed out. Please try again.'));
      };

      xhr.timeout = options.timeout || 15 * 60 * 1000;

      xhr.send(formData);
    });
  }

  async uploadFile(file) {
    // 1. Try Multipart FormData
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('file', file);
      const res = await this.post('/upload', formData);
      if (res?.url || res?.urls?.length) {
        return res;
      }
    } catch (formErr) {
      console.warn('Multipart upload error, attempting Base64 upload fallback:', formErr?.message);
    }

    // 2. Base64 fallback if file is a Blob/File
    if (file instanceof Blob || file instanceof File) {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return this.post('/upload', { image: base64Data });
    }

    // 3. If file is already a base64 string
    if (typeof file === 'string' && file.startsWith('data:image')) {
      return this.post('/upload', { image: file });
    }

    throw new Error('Unable to upload image file. Please try again.');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

