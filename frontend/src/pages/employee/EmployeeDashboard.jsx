import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../api/events.api";
import { getReservations } from "../../api/reservations.api";
import Loading from "../../components/common/Loading";

const extractApiError = (e, fallback) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  fallback;

export default function EmployeeDashboard() {
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [eventsData, reservationsData] = await Promise.all([
        getEvents(),
        getReservations(),
      ]);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
    } catch (e) {
      setError(extractApiError(e, "Failed to load dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeEvent = useMemo(
    () =>
      events.find((ev) => String(ev.status).toUpperCase() === "ACTIVE") || null,
    [events],
  );

  // Calculate metrics for active event
  const metrics = useMemo(() => {
    if (!activeEvent) {
      return {
        totalReservations: 0,
        totalReservedStalls: 0,
      };
    }

    const activeReservations = reservations.filter(
      (r) =>
        r.eventId === activeEvent.id &&
        String(r.status).toUpperCase() !== "CANCELLED",
    );

    const reservedStallsSet = new Set();
    activeReservations.forEach((reservation) => {
      if (Array.isArray(reservation.stallIds)) {
        reservation.stallIds.forEach((stallId) =>
          reservedStallsSet.add(stallId),
        );
      }
    });

    return {
      totalReservations: activeReservations.length,
      totalReservedStalls: reservedStallsSet.size,
    };
  }, [activeEvent, reservations]);

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            to="/employee/dashboard"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white"
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
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-dark)]">
          Employee Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview and quick actions for employees.
        </p>

        {error && (
          <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        {/* Active Event Section */}
        <div className="mt-6">
          {activeEvent ? (
            <div className="p-4 border rounded-2xl bg-blue-50 border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900">
                Active Event
              </h2>
              <div className="mt-2">
                <p className="font-semibold text-[var(--color-dark)]">
                  {activeEvent.name}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(activeEvent.startDate).toLocaleDateString()} to{" "}
                  {new Date(activeEvent.endDate).toLocaleDateString()} |{" "}
                  {activeEvent.year}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-2xl bg-yellow-50 border-yellow-200">
              <h2 className="text-lg font-semibold text-yellow-900">
                No Active Event
              </h2>
              <p className="mt-1 text-sm text-yellow-700">
                There is currently no active event. Go to Events to activate
                one.
              </p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="p-6 bg-white border rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reservations
                </p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-dark)]">
                  {metrics.totalReservations}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {activeEvent ? `For ${activeEvent.name}` : "No active event"}
            </p>
          </div>

          <div className="p-6 bg-white border rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reserved Stalls
                </p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-dark)]">
                  {metrics.totalReservedStalls}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {activeEvent ? `For ${activeEvent.name}` : "No active event"}
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--color-dark)]">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <Link
              to="/employee/events"
              className="p-4 transition-shadow bg-white border rounded-2xl hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-dark)]">
                    Events
                  </p>
                  <p className="text-xs text-gray-500">Manage events</p>
                </div>
              </div>
            </Link>

            <Link
              to="/employee/stalls"
              className="p-4 transition-shadow bg-white border rounded-2xl hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-dark)]">
                    Stalls
                  </p>
                  <p className="text-xs text-gray-500">Manage stall layout</p>
                </div>
              </div>
            </Link>

            <Link
              to="/employee/reservations"
              className="p-4 transition-shadow bg-white border rounded-2xl hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-100">
                  <svg
                    className="w-5 h-5 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-dark)]">
                    Reservations
                  </p>
                  <p className="text-xs text-gray-500">View all reservations</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
