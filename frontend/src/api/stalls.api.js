import api from "./axiosInstance";

/**
 * Get stalls for an event (viewer/reserve/edit)
 * Should return stalls with reserved/free info for this event.
 */
export const getStallsByEvent = async (eventId) => {
  const res = await api.get(`/api/stalls/event/${eventId}`);
  return res.data;
};

/**
 * Get all stalls (employee editor)
 */
export const getAllStalls = async () => {
  const res = await api.get("/api/stalls");
  return res.data;
};

/**
 * Create stall (employee)
 * payload: { stallCode, size, x, y }
 */
export const createStall = async (payload) => {
  const res = await api.post("/api/stalls", payload);
  return res.data;
};

/**
 * Update stall position / details (employee)
 */
export const updateStall = async (stallId, payload) => {
  const res = await api.put(`/api/stalls/${stallId}`, payload);
  return res.data;
};

/**
 * Delete stall (employee)
 */
export const deleteStall = async (stallId) => {
  const res = await api.delete(`/api/stalls/${stallId}`);
  return res.data;
};

/**
 * Bulk save stall layout (employee)
 * payload: [{id, x, y, ...}, ...]
 */
export const saveStallLayout = async (payload) => {
  const res = await api.put("/api/stalls/layout", payload);
  return res.data;
};
