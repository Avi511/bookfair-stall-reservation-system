import api from "./axiosInstance";

/**
 * Create reservation (user)
 * payload: { eventId, stallIds: [..] }
 */
export const createReservation = async ({ eventId, stallIds }) => {
  const res = await api.post("/reservations", { eventId, stallIds });
  return res.data;
};

/**
 * Get my reservations (user)
 * params example: { eventId, status }
 */
export const getMyReservations = async (params = {}) => {
  const res = await api.get("/reservations/me", { params });
  return res.data;
};

/**
 * Get all reservations (employee)
 * params example: { eventId, status }
 */
export const getReservations = async (params = {}) => {
  const res = await api.get("/reservations", { params });
  return res.data;
};

/**
 * Get reservation by id (user edit page, employee details)
 */
export const getReservationById = async (id) => {
  const res = await api.get("/reservations/me");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.find((reservation) => String(reservation?.id) === String(id)) || null;
};

/**
 * Update reservation stalls (user edit)
 * payload: { stallIds: [..] }
 */
export const updateReservation = async (id, { stallIds }) => {
  const res = await api.put(`/reservations/${id}/stalls`, { stallIds });
  return res.data;
};

/**
 * Cancel reservation (user)
 */
export const cancelReservation = async (id) => {
  // could be PATCH or PUT depending backend - change if needed
  const res = await api.patch(`/reservations/${id}`);
  return res.data;
};
