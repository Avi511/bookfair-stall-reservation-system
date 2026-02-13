import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import StallMap from "../components/stalls/StallMap";
import Loading from "../components/common/Loading";

import { getStallsByEvent } from "../api/stalls.api";
import { createReservation } from "../api/reservations.api";

export default function ReserveStalls() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [stalls, setStalls] = useState([]);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch stalls for the event
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const data = await getStallsByEvent(eventId);
        if (!alive) return;

        setStalls(Array.isArray(data) ? data : []);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load stalls.";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [eventId]);

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

  // Toggle selection (max 3)
  function onToggleSelect(stallId) {
    setError("");

    setSelected((prev) => {
      const exists = prev.includes(stallId);

      if (exists) return prev.filter((x) => x !== stallId);

      if (prev.length >= 3) {
        setError("You can select maximum 3 stalls.");
        return prev;
      }

      return [...prev, stallId];
    });
  }

  // Confirm reservation
  async function onConfirm() {
    setError("");

    if (selected.length < 1) {
      setError("Select at least 1 stall.");
      return;
    }

    try {
      setSaving(true);

      const res = await createReservation({
        eventId: Number(eventId),
        stallIds: selected,
      });

      // Try to extract reservation id from response
      // supports: { id: 123 } OR { reservationId: 123 } OR { data: { id: 123 } }
      const newId =
        res?.id || res?.reservationId || res?.data?.id || res?.data?.reservationId;

      if (!newId) {
        // If backend doesn’t return the id, still redirect to /me
        navigate("/me", { replace: true });
        return;
      }

      // ✅ Redirect to genres page
      navigate(`/genres?reservationId=${newId}`, { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to create reservation.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading text="Loading stalls..." />;

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]">
            Reserve Stalls
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Event ID: <span className="font-semibold">{eventId}</span>
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
          {error}
        </div>
      )}

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
              Selected: <span className="font-semibold">{selected.length}</span> / 3
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {selected.length === 0 ? (
                <span className="text-sm text-gray-500">No stalls selected</span>
              ) : (
                selected.map((sid) => (
                  <span
                    key={sid}
                    className="px-3 py-1 text-sm bg-gray-100 border rounded-full"
                  >
                    #{sid}
                  </span>
                ))
              )}
            </div>

            <button
              onClick={onConfirm}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Confirming..." : "Confirm Reservation"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Reserved stalls (grey) cannot be selected. You can reserve up to 3 stalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
