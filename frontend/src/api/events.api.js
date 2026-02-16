import api from "./axiosInstance";

/**
 * List events with optional filters.
 * params example: { status: "ACTIVE", year: 2026 }
 */
export const getEvents = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data;
};

/**
 * Get active events via status filter (backend-aligned).
 */
export const getActiveEvent = async () => getEvents({ status: "ACTIVE" });

/**
 * Get event by id.
 */
export const getEventById = async (eventId) => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};

/**
 * Create event (employee)
 */
export const createEvent = async (payload) => {
  // payload: { name, year, startDate, endDate, status }
  const res = await api.post("/events", payload);
  return res.data;
};

/**
 * Update event (employee)
 */
export const updateEvent = async (eventId, payload) => {
  const res = await api.put(`/events/${eventId}`, payload);
  return res.data;
};

/**
 * Set active event (employee) - only 1 should be active
 */
export const setActiveEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/status`, { status: "ACTIVE" });
  return res.data;
};

/**
 * End event (employee)
 */
export const endEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/status`, { status: "ENDED" });
  return res.data;
};
