import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getReservations } from "../../api/reservations.api";
import { getEvents } from "../../api/events.api";
import { getGenres } from "../../api/genres.api";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const extractApiError = (e, fallback) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  fallback;

export default function EmployeeReservations() {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterEventId, setFilterEventId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reservationsData, eventsData, genresData] = await Promise.all([
        getReservations(),
        getEvents(),
        getGenres(),
      ]);
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setGenres(Array.isArray(genresData) ? genresData : []);
    } catch (e) {
      setError(extractApiError(e, "Failed to load reservations."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReservations = useMemo(() => {
    let result = [...reservations];

    if (filterEventId) {
      result = result.filter(
        (r) => String(r.eventId) === String(filterEventId),
      );
    }

    if (filterStatus) {
      result = result.filter(
        (r) => String(r.status).toUpperCase() === filterStatus.toUpperCase(),
      );
    }

    return result;
  }, [reservations, filterEventId, filterStatus]);

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : `Event #${eventId}`;
  };

  const getGenreNames = (genreIds) => {
    if (!genreIds || genreIds.length === 0) return "None";
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : `#${id}`;
      })
      .join(", ");
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <Loading text="Loading reservations..." />;
  }

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
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white"
          >
            Reservations
          </Link>
          <Link
            to="/employee/genres"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Genres
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-dark)]">
          Employee Reservation Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all reservations. Filter by event and status.
        </p>

        {error && (
          <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 p-4 mt-6 bg-white border md:grid-cols-2 rounded-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Event
            </label>
            <div className="relative mt-1">
              <select
                value={filterEventId}
                onChange={(e) => setFilterEventId(e.target.value)}
                className="w-full px-3 py-2 pr-10 border appearance-none rounded-xl"
              >
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <div className="relative mt-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 pr-10 border appearance-none rounded-xl"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <ChevronDown className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredReservations.length} of {reservations.length}{" "}
          reservation(s)
        </div>

        <div className="mt-4 overflow-hidden bg-white border rounded-2xl">
          {filteredReservations.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No Reservations Found"
                description="No reservations match your current filters."
              />
            </div>
          ) : (
            <div className="divide-y">
              {filteredReservations.map((reservation) => {
                const isExpanded = expandedId === reservation.id;
                const stallsList = Array.isArray(reservation.stallIds)
                  ? reservation.stallIds.join(", ")
                  : "None";
                const genresList = getGenreNames(reservation.genreIds);
                const status = String(
                  reservation.status || "PENDING",
                ).toUpperCase();

                return (
                  <div key={reservation.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[var(--color-dark)]">
                            Reservation #{reservation.id}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs border rounded-full ${
                              status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : status === "CANCELLED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">User ID:</span>{" "}
                            {reservation.userId}
                          </p>
                          <p>
                            <span className="font-medium">Event:</span>{" "}
                            {getEventName(reservation.eventId)}
                          </p>
                          <p>
                            <span className="font-medium">Stalls:</span>{" "}
                            {stallsList}
                          </p>
                          <p>
                            <span className="font-medium">Genres:</span>{" "}
                            {genresList}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpand(reservation.id)}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        {isExpanded ? "Hide Details" : "Show Details"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-4 mt-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold text-[var(--color-dark)]">
                          Full Details
                        </h3>
                        <div className="grid grid-cols-1 gap-3 mt-3 text-sm md:grid-cols-2">
                          <div>
                            <p className="font-medium text-gray-700">
                              Reservation ID
                            </p>
                            <p className="text-gray-600">{reservation.id}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">User ID</p>
                            <p className="text-gray-600">
                              {reservation.userId}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Event</p>
                            <p className="text-gray-600">
                              {getEventName(reservation.eventId)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Status</p>
                            <p className="text-gray-600">{status}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-700">
                              Reserved Stalls
                            </p>
                            <p className="text-gray-600">{stallsList}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-700">
                              Selected Genres
                            </p>
                            <p className="text-gray-600">{genresList}</p>
                          </div>
                          {reservation.createdAt && (
                            <div className="md:col-span-2">
                              <p className="font-medium text-gray-700">
                                Created At
                              </p>
                              <p className="text-gray-600">
                                {new Date(
                                  reservation.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
