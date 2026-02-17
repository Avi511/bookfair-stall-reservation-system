import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import {
  createGenre,
  deleteGenre,
  getGenres,
  updateGenre,
} from "../../api/genres.api";

const extractApiError = (e, fallback) =>
  e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback;

export default function EmployeeGenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadGenres = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGenres();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || "")),
      );
      setGenres(sorted);
    } catch (e) {
      setError(extractApiError(e, "Failed to load genres."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Genre name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateGenre({ id: editingId, name: trimmed });
        setMsg("Genre updated.");
      } else {
        await createGenre({ name: trimmed });
        setMsg("Genre created.");
      }
      resetForm();
      await loadGenres();
    } catch (e2) {
      setError(extractApiError(e2, "Failed to save genre."));
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (genre) => {
    setEditingId(genre?.id || null);
    setName(genre?.name || "");
    setError("");
    setMsg("");
  };

  const removeGenre = async (genre) => {
    const genreId = genre?.id;
    if (!genreId) return;

    const ok = window.confirm(`Delete genre "${genre?.name || genreId}"?`);
    if (!ok) return;

    setError("");
    setMsg("");
    setSaving(true);
    try {
      await deleteGenre(genreId);
      if (editingId === genreId) resetForm();
      setMsg("Genre deleted.");
      await loadGenres();
    } catch (e) {
      setError(extractApiError(e, "Failed to delete genre."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading genres..." />;

  return (
    <div className="min-h-screen px-4 py-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            to="/employee/dashboard"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            to="/employee/events"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Events
          </Link>
          <Link
            to="/employee/stalls"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Stalls
          </Link>
          <Link
            to="/employee/reservations"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Reservations
          </Link>
          <Link
            to="/employee/genres"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white"
          >
            Genres
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-dark)]">
          Employee Genre Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Add, edit, and remove genres available for reservations.
        </p>

        {error && <Alert type="error">{error}</Alert>}
        {msg && <Alert type="success">{msg}</Alert>}

        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <form onSubmit={onSubmit} className="p-4 bg-white border rounded-2xl">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Genre" : "Add Genre"}</h2>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">
                  Genre Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border rounded-xl"
                  placeholder="e.g. Fiction"
                  maxLength={255}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 font-semibold text-white rounded-xl bg-[var(--color-primary)] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Genre" : "Add Genre"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 font-semibold border rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-hidden bg-white border rounded-2xl">
              <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Genres</h2>
              </div>
              {genres.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">No genres found.</div>
              ) : (
                <div className="divide-y">
                  {genres.map((genre) => (
                    <div key={genre.id} className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--color-dark)]">
                            {genre.name}
                          </p>
                          <p className="text-xs text-gray-500">ID: {genre.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => beginEdit(genre)}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm text-white rounded-lg bg-rose-600 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
