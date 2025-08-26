import axios from 'axios';

// Use import.meta.env instead of process.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || '/admin'
});

export function setAPIToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    adminAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete adminAPI.defaults.headers.common['Authorization'];
  }
}

export { adminAPI };
export default api;
