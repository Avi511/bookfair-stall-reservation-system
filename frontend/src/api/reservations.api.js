import api from "./axiosInstance";

export const createReservation = async ({ eventId, stallIds }) => {
  const res = await api.post("/reservations", { eventId, stallIds });
  return res.data;
};

export const getMyReservations = async (params = {}) => {
  const res = await api.get("/reservations/me", { params });
  return res.data;
};

export const getReservations = async (params = {}) => {
  const res = await api.get("/reservations", { params });
  return res.data;
};

export const getReservationById = async (id) => {
  const res = await api.get("/reservations/me");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.find((reservation) => String(reservation?.id) === String(id)) || null;
};

export const updateReservation = async (id, { stallIds }) => {
  const res = await api.put(`/reservations/${id}/stalls`, { stallIds });
  return res.data;
};

export const cancelReservation = async (id) => {
  const res = await api.patch(`/reservations/${id}`);
  return res.data;
};
