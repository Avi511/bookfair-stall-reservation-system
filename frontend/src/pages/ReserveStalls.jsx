import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import StallMap from "../components/stalls/StallMap";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";

import { getStallsByEvent } from "../api/stalls.api";
import { createReservation, getMyReservations } from "../api/reservations.api";
import { getActiveEvent, getEvents } from "../api/events.api";

export default function ReserveStalls() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [stalls, setStalls] = useState([]);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeEventInfo, setActiveEventInfo] = useState(null);
  const [nextEvents, setNextEvents] = useState([]);
  const [existingReservedStallIds, setExistingReservedStallIds] = useState([]);
  const [reservedLoadError, setReservedLoadError] = useState("");

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  // Fetch stalls for the event
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        let resolvedEventId = eventId;

        if (!resolvedEventId) {
          const active = await getActiveEvent();
          const activeEvent = Array.isArray(active) ? active[0] : active;
          resolvedEventId = activeEvent?.id;
        }

        if (!resolvedEventId) {
          throw new Error("No active event available.");
        }

        const numericEventId = Number(resolvedEventId);
        if (!numericEventId) {
          throw new Error("Invalid event.");
        }

        setActiveEventId(numericEventId);
        const data = await getStallsByEvent(resolvedEventId);
        if (!alive) return;

        setStalls(Array.isArray(data) ? data : []);
      } catch (e) {
        const raw =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load stalls.";
        const text = String(raw || "").toLowerCase();
        const msg = text.includes("active")
          ? "No active event is available right now."
          : "Unable to load the stall map. Please try again.";
        toast.error(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [eventId]);

  useEffect(() => {
    let alive = true;

    async function loadEventInfo() {
      try {
        const [activeRes, eventsRes] = await Promise.all([getActiveEvent(), getEvents()]);
        if (!alive) return;

        const active = Array.isArray(activeRes) ? activeRes[0] : activeRes;
        const allEvents = Array.isArray(eventsRes) ? eventsRes : [];
        const now = new Date();

        const upcoming = allEvents
          .filter((e) => e?.id && e?.id !== active?.id)
          .filter((e) => {
            const start = e?.startDate ? new Date(e.startDate) : null;
            return start && !Number.isNaN(start.getTime()) && start > now;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);

        setActiveEventInfo(active || null);
        setNextEvents(upcoming);
      } catch {
        if (!alive) return;
        setActiveEventInfo(null);
        setNextEvents([]);
      }
    }

    loadEventInfo();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadMyReservedStalls() {
      if (!activeEventId) return;

      try {
        setReservedLoadError("");
        let data;
        try {
          data = await getMyReservations({ eventId: activeEventId });
        } catch {
          data = await getMyReservations();
        }
        if (!alive) return;

        const reservations = Array.isArray(data) ? data : [];
        const reserved = new Set();

        reservations.forEach((reservation) => {
          const reservationEventId = Number(reservation?.eventId);
          if (reservationEventId && reservationEventId !== Number(activeEventId)) {
            return;
          }

          const status = String(reservation?.status || "").toUpperCase();
          if (status === "CANCELLED") return;

          if (Array.isArray(reservation?.stallIds)) {
            reservation.stallIds.forEach((id) => {
              const numericId = Number(id);
              if (numericId) reserved.add(numericId);
            });
          }

          if (Array.isArray(reservation?.stalls)) {
            reservation.stalls.forEach((stall) => {
              const numericId = Number(stall?.id);
              if (numericId) reserved.add(numericId);
            });
          }
        });

        setExistingReservedStallIds(Array.from(reserved));
      } catch {
        if (!alive) return;
        setExistingReservedStallIds([]);
        setReservedLoadError("Unable to load your existing reserved stalls right now.");
      }
    }

    loadMyReservedStalls();
    return () => {
      alive = false;
    };
  }, [activeEventId]);

  // Determine which stalls are reserved (disabled)
  const disabledStallIds = useMemo(() => {
    const disabled = [];

    for (const s of stalls) {
      const isReserved =
        s.reserved === true ||
        s.isReserved === true ||
        (typeof s.reservationId === "number" && s.reservationId > 0) ||
        (typeof s.reservedByReservationId === "number" && s.reservedByReservationId > 0);

      if (isReserved) disabled.push(s.id);
    }

    return disabled;
  }, [stalls]);

  const stallCodeById = useMemo(() => {
    return new Map(stalls.map((s) => [s.id, s.stallCode || `Stall ${s.id}`]));
  }, [stalls]);

  const maxAllowedStalls = 3;
  const alreadyReservedCount = existingReservedStallIds.length;
  const remainingSelectable = Math.max(0, maxAllowedStalls - alreadyReservedCount);

  // Toggle selection (max 3)
  function onToggleSelect(stallId) {
    const exists = selected.includes(stallId);
    if (exists) {
      setSelected((prev) => prev.filter((x) => x !== stallId));
      return;
    }

    if (remainingSelectable <= 0) {
      toast.error("You already reserved the maximum 3 stalls.");
      return;
    }

    if (selected.length >= remainingSelectable) {
      toast.error(`You can select only ${remainingSelectable} more stall(s).`);
      return;
    }

    setSelected((prev) => [...prev, stallId]);
  }

  // Confirm reservation
  async function onConfirm() {
    if (selected.length < 1) {
      toast.error("Select at least 1 stall.");
      return;
    }

    try {
      setSaving(true);

      const res = await createReservation({
        eventId: Number(eventId) || activeEventId,
        stallIds: selected,
      });

      // Try to extract reservation id from response
      // supports: { id: 123 } OR { reservationId: 123 } OR { data: { id: 123 } }
      const newId =
        res?.id || res?.reservationId || res?.data?.id || res?.data?.reservationId;

      if (!newId) {
        // If backend doesn’t return the id, still redirect to /me
        toast.success("Reservation confirmed successfully.");
        navigate("/me", { replace: true });
        return;
      }

      // ✅ Redirect to genres page
      toast.success("Reservation confirmed successfully.");
      navigate(`/genres?reservationId=${newId}`, { replace: true });
    } catch (e) {
      // API errors are shown globally by axios interceptor toast handling.
      if (!e?.response) {
        toast.error("Unable to confirm reservation right now. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading text="Loading stalls..." />;

  if (!loading && stalls.length === 0) {
    return (
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <EmptyState
          title="No active event or no stalls available"
          description="There are no stalls available for reservation at the moment. Please check back later or contact event organizers."
          action={<button onClick={() => navigate(-1)} className="px-4 py-2 mt-4 rounded-xl border">Go Back</button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]">
            Reserve Stalls
          </h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
        <div className="p-4 border rounded-2xl bg-white">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Current Active Event
          </p>
          {activeEventInfo ? (
            <>
              <p className="mt-1 text-base font-semibold text-[var(--color-dark)]">
                {activeEventInfo.name || `Event #${activeEventInfo.id}`}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {formatDate(activeEventInfo.startDate)} to {formatDate(activeEventInfo.endDate)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-gray-600">No active event right now.</p>
          )}
        </div>

        <div className="p-4 border rounded-2xl bg-white">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Next Events
          </p>
          {nextEvents.length === 0 ? (
            <p className="mt-1 text-sm text-gray-600">No upcoming events found.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {nextEvents.map((ev) => (
                <div key={ev.id} className="text-sm">
                  <p className="font-semibold text-[var(--color-dark)]">
                    {ev.name || `Event #${ev.id}`}
                  </p>
                  <p className="text-gray-600">
                    {formatDate(ev.startDate)} to {formatDate(ev.endDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StallMap
            stalls={stalls}
            selectedStallIds={selected}
            disabledStallIds={disabledStallIds}
            highlightStallIds={[]} // none in reserve page
            onToggleSelect={onToggleSelect}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="p-4 bg-white border rounded-2xl">
            <h2 className="text-lg font-semibold text-[var(--color-dark)]">
              Your Selection
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Selected: <span className="font-semibold">{selected.length}</span> / {remainingSelectable}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Already Reserved: <span className="font-semibold">{alreadyReservedCount}</span> / {maxAllowedStalls}
            </p>
            {reservedLoadError && (
              <p className="mt-1 text-xs text-amber-700">
                {reservedLoadError}
              </p>
            )}

            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Your Reserved Stalls
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {existingReservedStallIds.length === 0 ? (
                  <span className="text-sm text-gray-500">No reserved stalls yet</span>
                ) : (
                  existingReservedStallIds.map((sid) => (
                    <span
                      key={`reserved-${sid}`}
                      className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full"
                    >
                      {stallCodeById.get(sid) || `Stall ${sid}`}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {selected.length === 0 ? (
                <span className="text-sm text-gray-500">No stalls selected</span>
              ) : (
                selected.map((sid) => (
                  <span
                    key={sid}
                    className="px-3 py-1 text-sm bg-gray-100 border rounded-full"
                  >
                    {stallCodeById.get(sid) || `Stall ${sid}`}
                  </span>
                ))
              )}
            </div>

            <button
              onClick={onConfirm}
              disabled={saving || selected.length === 0 || remainingSelectable <= 0}
              className="mt-5 w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Confirming..." : "Confirm Reservation"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Reserved stalls (grey) cannot be selected. You can reserve up to 3 stalls in total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
