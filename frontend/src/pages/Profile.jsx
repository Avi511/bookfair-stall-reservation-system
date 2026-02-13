import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/common/Loading";
import { getActiveEvent } from "../api/events.api";
import { cancelReservation, getMyReservations } from "../api/reservations.api";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const readReservationId = (reservation) =>
  reservation?.id || reservation?.reservationId || reservation?.reservation?.id;

const readEventLabel = (reservation) =>
  reservation?.event?.name ||
  reservation?.event?.title ||
  reservation?.eventName ||
  reservation?.eventId ||
  reservation?.event?.id ||
  "Unknown Event";

const readStatus = (reservation) =>
  reservation?.status || reservation?.reservationStatus || "UNKNOWN";

const readStallLabels = (reservation) => {
  if (Array.isArray(reservation?.stallIds)) {
    return reservation.stallIds.map((id) => `#${id}`);
  }

  if (Array.isArray(reservation?.stalls)) {
    return reservation.stalls.map((stall) => `#${stall?.id ?? stall}`);
  }

  return [];
};

export default function Profile() {
  const navigate = useNavigate();

  const [activeEvent, setActiveEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadActiveEvent = async () => {
      try {
        const event = await getActiveEvent();
        if (!alive) return;
        const active = Array.isArray(event) ? event[0] : event;
        setActiveEvent(active || null);
        if (active?.id) setSelectedEventId(String(active.id));
      } catch {
        if (alive) setActiveEvent(null);
      }
    };

    loadActiveEvent();

    return () => {
      alive = false;
    };
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (selectedEventId !== "ALL") {
        params.eventId = Number(selectedEventId);
      }
      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }

      const data = await getMyReservations(params);
      setReservations(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to load reservations.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [selectedEventId, selectedStatus]);

  const statusOptions = useMemo(() => {
    const dataStatuses = reservations
      .map((resv) => readStatus(resv))
      .filter(Boolean);
    const unique = Array.from(new Set(dataStatuses));
    const merged = new Set([...STATUS_OPTIONS, ...unique]);
    return Array.from(merged);
  }, [reservations]);

  const onCancel = async (reservationId) => {
    if (!reservationId) return;

    try {
      setCancelingId(reservationId);
      await cancelReservation(reservationId);
      await loadReservations();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to cancel reservation.";
      setError(msg);
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <Loading text="Loading your dashboard..." />;

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]">
            Profile Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {activeEvent?.name
              ? `Active event: ${activeEvent.name}`
              : "Active event not available"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            className="px-3 py-2 text-sm border rounded-xl"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="ALL">All events</option>
            {activeEvent?.id && (
              <option value={String(activeEvent.id)}>
                {activeEvent.name || `Event ${activeEvent.id}`}
              </option>
            )}
          </select>

          <select
            className="px-3 py-2 text-sm border rounded-xl"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {reservations.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 bg-white border rounded-2xl">
            No reservations found for the selected filters.
          </div>
        ) : (
          reservations.map((reservation, index) => {
            const reservationId = readReservationId(reservation);
            const status = readStatus(reservation);
            const stalls = readStallLabels(reservation);
            const isCancelled = String(status).toUpperCase().includes("CANCEL");

            return (
              <div
                key={reservationId || `reservation-${index}`}
                className="p-5 bg-white border rounded-2xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-dark)]">
                      Reservation {reservationId ? `#${reservationId}` : ""}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Event: {readEventLabel(reservation)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Status: {status}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {stalls.length === 0 ? (
                        <span className="text-sm text-gray-500">
                          No stalls listed
                        </span>
                      ) : (
                        stalls.map((stall) => (
                          <span
                            key={stall}
                            className="px-3 py-1 text-xs bg-gray-100 border rounded-full"
                          >
                            {stall}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={!reservationId}
                      onClick={() =>
                        navigate(`/reservations/${reservationId}/edit`)
                      }
                      className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        !reservationId ||
                        isCancelled ||
                        cancelingId === reservationId
                      }
                      onClick={() => onCancel(reservationId)}
                      className="px-4 py-2 text-sm text-white rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60"
                    >
                      {cancelingId === reservationId
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
