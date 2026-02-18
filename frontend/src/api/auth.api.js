import api from "./axiosInstance";


export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};


export const register = async ({ email, password, businessName }) => {
  const res = await api.post("/users", { email, password, businessName });
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
