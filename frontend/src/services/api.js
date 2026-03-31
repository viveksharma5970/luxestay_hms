import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends HttpOnly JWT cookie automatically
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong';
    if (err.response?.status === 401) {
      window.location.href = '/login';
    } else {
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);

export default api;
