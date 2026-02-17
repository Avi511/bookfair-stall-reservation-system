import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import {
  createEvent,
  endEvent,
  getEvents,
  setActiveEvent,
  updateEvent,
} from "../../../api/events.api";

const emptyForm = {
  name: "",
  year: new Date().getFullYear(),
  startDate: "",
  endDate: "",
  status: "DRAFT",
};

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const extractApiError = (e, fallback) =>
  e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback;

export default function EmployeeEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(extractApiError(e, "Failed to load events."));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadEvents();
  }, []);

  const activeEvent = useMemo(
    () => events.find((ev) => String(ev.status).toUpperCase() === "ACTIVE") || null,
    [events],
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.name.trim()) {
      setError("Event name is required.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError("Start and end dates are required.");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError("Start date must be on or before end date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        year: Number(form.year),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };

      if (editingId) {
        await updateEvent(editingId, {
          name: payload.name,
          year: payload.year,
          startDate: payload.startDate,
          endDate: payload.endDate,
        });
        setMsg("Event updated.");
      } else {
        await createEvent(payload);
        setMsg("Event created.");
      }

      resetForm();
      await loadEvents();
    } catch (e2) {
      setError(extractApiError(e2, "Failed to save event."));
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (event) => {
    setEditingId(event.id);
    setError("");
    setMsg("");
    setForm({
      name: event.name || "",
      year: event.year || new Date().getFullYear(),
      startDate: toInputDate(event.startDate),
      endDate: toInputDate(event.endDate),
      status: event.status || "DRAFT",
    });
  };

  const activate = async (event) => {
    setError("");
    setMsg("");

    // UI enforcement for single active event.
    if (activeEvent && activeEvent.id !== event.id) {
      setError(
        `Only one event can be ACTIVE. End "${activeEvent.name}" before activating another event.`,
      );
      return;
    }

    setSaving(true);
    try {
      await setActiveEvent(event.id);
      setMsg(`Activated "${event.name}".`);
      await loadEvents();
    } catch (e) {
      setError(extractApiError(e, "Failed to activate event."));
    } finally {
      setSaving(false);
    }
  };

  const end = async (event) => {
    setError("");
    setMsg("");
    setSaving(true);
    try {
      await endEvent(event.id);
      setMsg(`Ended "${event.name}".`);
      await loadEvents();
    } catch (e) {
      setError(extractApiError(e, "Failed to end event."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            to="/employee/stalls"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Stall Layout
          </Link>
          <Link
            to="/employee/events"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white"
          >
            Events
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-dark)]">Employee Event Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create, edit, activate, and end events. Only one event can be active at a time.
        </p>

        {activeEvent && (
          <div className="px-4 py-3 mt-4 text-sm text-blue-800 border border-blue-200 rounded-xl bg-blue-50">
            Active event: <span className="font-semibold">{activeEvent.name}</span>
          </div>
        )}

        {error && <Alert type="error">{error}</Alert>}
        {msg && <Alert type="success">{msg}</Alert>}

        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <form onSubmit={onSubmit} className="p-4 bg-white border rounded-2xl">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Event" : "Create Event"}</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 mt-1 border rounded-xl"
                    placeholder="Colombo Bookfair"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                    className="w-full px-3 py-2 mt-1 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2 mt-1 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2 mt-1 border rounded-xl"
                  />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                      className="w-full px-3 py-2 mt-1 border rounded-xl"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="ACTIVE">ACTIVE</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 font-semibold text-white rounded-xl bg-[var(--color-primary)] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
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
                <h2 className="text-lg font-semibold">Events</h2>
              </div>
              {loading ? (
                <div className="p-4 text-sm text-gray-600">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">No events found.</div>
              ) : (
                <div className="divide-y">
                  {events.map((event) => {
                    const status = String(event.status || "").toUpperCase();
                    const canActivate =
                      status !== "ACTIVE" && status !== "ENDED" && (!activeEvent || activeEvent.id === event.id);
                    const canEnd = status === "ACTIVE";

                    return (
                      <div key={event.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[var(--color-dark)]">{event.name}</p>
                            <p className="text-sm text-gray-600">
                              {toInputDate(event.startDate)} to {toInputDate(event.endDate)} | {event.year}
                            </p>
                            <p className="mt-1 text-xs">
                              <span className="px-2 py-1 border rounded-full bg-gray-50">{status}</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => beginEdit(event)}
                              disabled={saving || status === "ENDED"}
                              className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => activate(event)}
                              disabled={saving || !canActivate}
                              className="px-3 py-1.5 text-sm text-white rounded-lg bg-blue-600 disabled:opacity-60"
                            >
                              Activate
                            </button>
                            <button
                              type="button"
                              onClick={() => end(event)}
                              disabled={saving || !canEnd}
                              className="px-3 py-1.5 text-sm text-white rounded-lg bg-rose-600 disabled:opacity-60"
                            >
                              End
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
