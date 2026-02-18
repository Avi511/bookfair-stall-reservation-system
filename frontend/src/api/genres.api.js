import api from "./axiosInstance";

/**
 * Get all available genres
 */
export const getGenres = async () => {
  const res = await api.get("/genres");
  return res.data;
};

export const createGenre = async ({ name }) => {
  const res = await api.post("/genres", { name });
  return res.data;
};

export const updateGenre = async ({ id, name }) => {
  const res = await api.put(`/genres/${id}`, { name });
  return res.data;
};

export const deleteGenre = async (id) => {
  await api.delete(`/genres/${id}`);
};

/**
 * Get selected genres for a reservation
 */
export const getGenresByReservation = async (reservationId) => {
  const res = await api.get(`/reservations/${reservationId}/genres`);
  return res.data;
};

/**
 * Replace reservation genres
 * payload: { genreIds: [1,2,...] }
 */
export const updateReservationGenres = async ({ reservationId, genreIds }) => {
  const res = await api.put(`/reservations/${reservationId}/genres`, { genreIds });
  return res.data;
};
