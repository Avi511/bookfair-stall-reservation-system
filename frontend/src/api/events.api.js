import api from "./axiosInstance";

/**
 * Get active event (public + user + employee)
 */
export const getActiveEvent = async () => {
  const res = await api.get("/events/active");
  return res.data;
};

/**
 * List all events (employee usually)
 */
export const getEvents = async () => {
  const res = await api.get("/events");
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
