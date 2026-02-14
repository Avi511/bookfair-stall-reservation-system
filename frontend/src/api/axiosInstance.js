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

        // dispatch logout event so contexts can clear user state
        try {
          window.dispatchEvent(new Event("app:logout"));
        } catch (e) {
          // ignore
        }

        // Redirect to login with session expired flag
        window.location.href = "/login?sessionExpired=1";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Map some backend messages to friendlier messages for UI
    try {
      const resp = error.response;
      if (resp && resp.data) {
        const raw = String(resp.data.message || resp.data.error || "").toLowerCase();

        let friendly = null;

        if (raw.includes("stall") && (raw.includes("taken") || raw.includes("already"))) {
          friendly = "One or more selected stalls are already reserved. Please refresh and try again.";
        } else if (raw.includes("max") && raw.includes("3")) {
          friendly = "You can reserve up to 3 stalls only.";
        } else if (raw.includes("event") && (raw.includes("not active") || raw.includes("inactive") || raw.includes("closed"))) {
          friendly = "This event is not active. You cannot reserve stalls for this event.";
        }

        if (friendly) {
          resp.data.message = friendly;
        }
      }
    } catch (e) {
      // ignore mapping errors
    }

    // If we receive a plain 401 (not refresh flow), ensure token cleared and redirect
    if (error.response?.status === 401) {
      clearAccessToken();
      try { window.dispatchEvent(new Event("app:logout")); } catch (e) {}
      window.location.href = "/login?sessionExpired=1";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
