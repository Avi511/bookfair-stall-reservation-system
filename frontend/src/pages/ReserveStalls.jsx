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

  /* ================= LOAD STALLS ================= */
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

        if (!resolvedEventId) throw new Error("No active event available.");

        const numericEventId = Number(resolvedEventId);
        if (!numericEventId) throw new Error("Invalid event.");

        setActiveEventId(numericEventId);

        const data = await getStallsByEvent(resolvedEventId);
        if (!alive) return;

        setStalls(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error("Unable to load the stall map. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => (alive = false);
  }, [eventId]);

  /* ================= LOAD EVENT INFO ================= */
  useEffect(() => {
    let alive = true;

    async function loadEventInfo() {
      try {
        const [activeRes, eventsRes] = await Promise.all([
          getActiveEvent(),
          getEvents(),
        ]);

        if (!alive) return;

        const active = Array.isArray(activeRes) ? activeRes[0] : activeRes;
        const allEvents = Array.isArray(eventsRes) ? eventsRes : [];
        const now = new Date();

        const upcoming = allEvents
          .filter((e) => e?.id && e?.id !== active?.id)
          .filter((e) => {
            const start = e?.startDate ? new Date(e.startDate) : null;
            return start && start > now;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);

        setActiveEventInfo(active || null);
        setNextEvents(upcoming);
      } catch {
        setActiveEventInfo(null);
        setNextEvents([]);
      }
    }

    loadEventInfo();
    return () => (alive = false);
  }, []);

  /* ================= LOAD MY RESERVATIONS ================= */
  useEffect(() => {
    let alive = true;

    async function loadMyReservedStalls() {
      if (!activeEventId) return;

      try {
        setReservedLoadError("");

        const data = await getMyReservations();
        if (!alive) return;

        const reservations = Array.isArray(data) ? data : [];
        const reserved = new Set();

        reservations.forEach((r) => {
          if (Number(r?.eventId) !== Number(activeEventId)) return;
          if (String(r?.status).toUpperCase() === "CANCELLED") return;

          r?.stallIds?.forEach((id) => reserved.add(Number(id)));
          r?.stalls?.forEach((s) => reserved.add(Number(s?.id)));
        });

        setExistingReservedStallIds(Array.from(reserved));
      } catch {
        setExistingReservedStallIds([]);
        setReservedLoadError("Unable to load your reserved stalls.");
      }
    }

    loadMyReservedStalls();
    return () => (alive = false);
  }, [activeEventId]);

  /* ================= MEMO ================= */
  const disabledStallIds = useMemo(() => {
    return stalls
      .filter(
        (s) =>
          s.reserved === true ||
          s.isReserved === true ||
          (typeof s.reservationId === "number" && s.reservationId > 0)
      )
      .map((s) => s.id);
  }, [stalls]);

  const stallCodeById = useMemo(() => {
    return new Map(
      stalls.map((s) => [s.id, s.stallCode || `Stall ${s.id}`])
    );
  }, [stalls]);

  const maxAllowedStalls = 3;
  const alreadyReservedCount = existingReservedStallIds.length;
  const remainingSelectable = Math.max(
    0,
    maxAllowedStalls - alreadyReservedCount
  );

  /* ================= SELECT ================= */
  function onToggleSelect(stallId) {
    if (selected.includes(stallId)) {
      setSelected((prev) => prev.filter((x) => x !== stallId));
      return;
    }

    if (remainingSelectable <= 0) {
      toast.error("You already reserved maximum 3 stalls.");
      return;
    }

    if (selected.length >= remainingSelectable) {
      toast.error(
        `You can select only ${remainingSelectable} more stall(s).`
      );
      return;
    }

    setSelected((prev) => [...prev, stallId]);
  }

  /* ================= CONFIRM ================= */
  async function onConfirm() {
    if (selected.length === 0) {
      toast.error("Select at least 1 stall.");
      return;
    }

    try {
      setSaving(true);

      const res = await createReservation({
        eventId: Number(eventId) || activeEventId,
        stallIds: selected,
      });

      const newId =
        res?.id || res?.reservationId || res?.data?.id;

      toast.success("Reservation confirmed successfully.");

      navigate("/", {
        replace: true,
        state: { reservationId: Number(newId) || null },
      });
    } catch {
      toast.error("Unable to confirm reservation.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading text="Loading stalls..." />;

  if (!loading && stalls.length === 0) {
    return (
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <EmptyState
          title="No stalls available"
          description="No stalls available right now."
          action={
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 mt-4 border rounded-xl"
            >
              Go Back
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reserve Stalls</h1>

      <StallMap
        stalls={stalls}
        selectedStallIds={selected}
        disabledStallIds={disabledStallIds}
        highlightStallIds={[]}
        onToggleSelect={onToggleSelect}
      />

      <div className="mt-6 p-4 bg-white border rounded-2xl">
        <p>
          Selected: {selected.length} / {remainingSelectable}
        </p>
        <p>
          Already Reserved: {alreadyReservedCount} / {maxAllowedStalls}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((sid) => (
            <span
              key={sid}
              className="px-3 py-1 bg-gray-100 border rounded-full"
            >
              {stallCodeById.get(sid) || `Stall ${sid}`}
            </span>
          ))}
        </div>

        <button
          onClick={onConfirm}
          disabled={
            saving ||
            selected.length === 0 ||
            remainingSelectable <= 0
          }
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-xl"
        >
          {saving ? "Confirming..." : "Confirm Reservation"}
        </button>
      </div>
    </div>
  );
}
