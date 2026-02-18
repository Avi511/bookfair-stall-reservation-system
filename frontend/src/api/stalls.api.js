import api from "./axiosInstance";


export const getStallsByEvent = async (eventId) => {
  const res = await api.get(`/stalls/event/${eventId}`);
  return res.data;
};


export const getAllStalls = async () => {
  const res = await api.get("/stalls");
  return res.data;
};


export const createStall = async (payload) => {
  const res = await api.post("/stalls", payload);
  return res.data;
};


export const updateStall = async (stallId, payload) => {
  const res = await api.put(`/stalls/${stallId}`, payload);
  return res.data;
};


export const deleteStall = async (stallId) => {
  const res = await api.delete(`/stalls/${stallId}`);
  return res.data;
};

