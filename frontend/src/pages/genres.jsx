import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loading from "../components/common/Loading";
import {
  getGenres,
  getGenresByReservation,
  updateReservationGenres,
} from "../api/genres.api";

export default function Genres() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [genres, setGenres] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGenres = async () => {
    if (!reservationId) return;

    try {
      setLoading(true);
      setError("");

      const [allGenres, reservationGenres] = await Promise.all([
        getGenres(),
        getGenresByReservation(reservationId),
      ]);

      const genreList = Array.isArray(allGenres) ? allGenres : [];
      const selected = Array.isArray(reservationGenres)
        ? reservationGenres
        : [];

      setGenres(genreList);
      setSelectedGenreIds(
        selected.map((g) => g?.id).filter((id) => Number.isInteger(id)),
      );
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to load genres.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, [reservationId]);

  const onToggle = (id) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!reservationId) return;
    try {
      setSaving(true);
      setError("");

      await updateReservationGenres({
        reservationId: Number(reservationId),
        genreIds: selectedGenreIds,
      });
      toast.success("Genres updated successfully.");
      navigate("/", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to add genre.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!reservationId) {
    return (
      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="p-6 text-sm text-red-700 rounded-2xl bg-red-50">
          Reservation id is missing. Please return to your reservation and try
          again.
        </div>
      </div>
    );
  }

  if (loading) return <Loading text="Loading genres..." />;

  return (
    <div className="max-w-3xl px-4 py-6 mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">Genres</h1>
        <p className="mt-1 text-sm text-gray-600">
          Reservation ID: <span className="font-semibold">{reservationId}</span>
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {genres.map((genre) => {
            const id = genre?.id;
            const label = genre?.name || `Genre ${id}`;
            if (!Number.isInteger(id)) return null;

            return (
              <label
                key={id}
                className="flex items-center gap-3 p-3 bg-white border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(id)}
                  onChange={() => onToggle(id)}
                />
                <span className="text-sm">{label}</span>
              </label>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 mt-5 text-sm text-white rounded-xl bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Genres"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {genres.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 bg-white border rounded-2xl">
            No genres found.
          </div>
        ) : (
          genres
            .filter((genre) => selectedGenreIds.includes(genre?.id))
            .map((genre, index) => (
              <div
                key={genre?.id || genre?.name || index}
                className="flex items-center justify-between p-4 bg-white border rounded-2xl"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--color-dark)]">
                    {genre?.name || genre?.genre || "Untitled"}
                  </p>
                  {genre?.description && (
                    <p className="mt-1 text-xs text-gray-500">
                      {genre.description}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 border rounded-full">
                  Selected
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
