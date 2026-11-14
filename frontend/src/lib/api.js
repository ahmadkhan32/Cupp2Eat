import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://backend-rpv5-git-main-ahmads-projects-3635a9cd.vercel.app/api/v1';
  }
  return 'http://localhost:4000/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
        // Only redirect if unauthorized on protected user paths
      }
    }
    return Promise.reject(error);
  }
);

export default api;
