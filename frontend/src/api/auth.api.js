import api from "./axiosInstance";

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async ({ email, password, businessName }) => {
  const res = await api.post("/users", { email, password, businessName });
  return res.data;
};

export const requestRegisterOtp = async ({ email }) => {
  const res = await api.post("/users/request-otp", { email });
  return res.data;
};

export const registerWithOtp = async ({ email, password, businessName, otp }) => {
  const res = await api.post("/users", { email, password, businessName, otp });
  return res.data;
};


export const registerEmployee = async ({ email, password }) => {
  const res = await api.post("/employees", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const res = await api.post("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const forgotPassword = async ({ email }) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const res = await api.post("/auth/reset-password", { email, otp, newPassword });
  return res.data;
};
