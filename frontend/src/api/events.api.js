import api from "./axiosInstance";


export const getEvents = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data;
};


export const getActiveEvent = async () => getEvents({ status: "ACTIVE" });


export const getEventById = async (eventId) => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};


export const createEvent = async (payload) => {
  const res = await api.post("/events", payload);
  return res.data;
};


export const updateEvent = async (eventId, payload) => {
  const res = await api.put(`/events/${eventId}`, payload);
  return res.data;
};


export const setActiveEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/status`, { status: "ACTIVE" });
  return res.data;
};


export const setInactiveEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/status`, { status: "INACTIVE" });
  return res.data;
};


export const endEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/status`, { status: "ENDED" });
  return res.data;
};

