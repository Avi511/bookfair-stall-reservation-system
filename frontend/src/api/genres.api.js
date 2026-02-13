import api from "./axiosInstance";

/**
 * Get genres for a reservation
 * example: GET /api/genres?reservationId=123
 */
export const getGenresByReservation = async (reservationId) => {
  const res = await api.get("/api/genres", { params: { reservationId } });
  return res.data;
};

/**
 * Add genre to reservation
 * payload: { reservationId, name }
 */
export const addGenre = async ({ reservationId, name }) => {
  const res = await api.post("/api/genres", { reservationId, name });
  return res.data;
};

/**
 * Delete genre (optional)
 */
export const deleteGenre = async (genreId) => {
  const res = await api.delete(`/api/genres/${genreId}`);
  return res.data;
};
