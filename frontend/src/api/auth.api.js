import api from "./axiosInstance";

/**
 * Login (Employee + User)
 * Expected response: { token: "..." } OR { accessToken: "..." }
 */
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

/**
 * Register (User only)
 * body: { email, password, businessName }
 */
export const register = async ({ email, password, businessName }) => {
  const res = await api.post("/users", { email, password, businessName });
  return res.data;
};

/**
 * Optional: get current user profile (if backend supports)
 */
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

/**
 * Optional: change password (if backend supports)
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const res = await api.post("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
