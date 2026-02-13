// src/api/axiosClient.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://bookfair-stall-reservation-system-production.up.railway.app/api";
const ACCESS_TOKEN_KEY = "accessToken";

// =============================
// Token helpers
// =============================
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

// =============================
// Axios instance
// =============================
const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // IMPORTANT (refresh cookie)
});

// =============================
// Request Interceptor
// Automatically attach access token
// =============================
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// =============================
// Response Interceptor
// Handle 401 + refresh logic
// =============================
let isRefreshing = false;
let failedQueue = [];

// resolve all queued requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint
        const res = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data?.token;

        if (!newToken) {
          throw new Error("No token returned from refresh");
        }

        setAccessToken(newToken);

        // update default header
        axiosClient.defaults.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();

        // Optional: redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
