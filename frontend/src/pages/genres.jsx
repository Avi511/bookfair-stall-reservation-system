import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Loading from "../components/common/Loading";
import { addGenre, getGenresByReservation } from "../api/genres.api";

export default function Genres() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGenres = async () => {
    if (!reservationId) return;

    try {
      setLoading(true);
      setError("");

      const data = await getGenresByReservation(reservationId);
      setGenres(Array.isArray(data) ? data : []);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!reservationId || !name.trim()) return;

    try {
      setSaving(true);
      setError("");

      await addGenre({
        reservationId: Number(reservationId),
        name: name.trim(),
      });
      setName("");
      await loadGenres();
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

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 mt-6 sm:flex-row"
      >
        <input
          type="text"
          placeholder="Add a genre (e.g. Fiction)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm text-white rounded-xl bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add Genre"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {genres.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 bg-white border rounded-2xl">
            No genres added yet.
          </div>
        ) : (
          genres.map((genre, index) => (
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
                Added
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
