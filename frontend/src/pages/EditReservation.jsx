import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import StallMap from "../components/stalls/StallMap";
import Loading from "../components/common/Loading";

import { getReservationById, updateReservation } from "../api/reservations.api";
import { getStallsByEvent } from "../api/stalls.api";

export default function EditReservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --- helpers to tolerate different backend shapes ---
  const reservationEventId = useMemo(() => {
    if (!reservation) return null;
    return (
      reservation.eventId ||
      reservation.event?.id ||
      reservation.event?.eventId ||
      null
    );
  }, [reservation]);

  const reservationStallIds = useMemo(() => {
    if (!reservation) return [];
    // supports: stallIds: [1,2] OR stalls: [{id:1},{id:2}]
    if (Array.isArray(reservation.stallIds)) return reservation.stallIds;
    if (Array.isArray(reservation.stalls)) return reservation.stalls.map((s) => s.id);
    return [];
  }, [reservation]);

  // Load reservation + stalls
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const resv = await getReservationById(id);
        if (!alive) return;
        if (!resv) {
          throw new Error("Reservation not found.");
        }

        setReservation(resv);

        const eventId =
          resv.eventId || resv.event?.id || resv.event?.eventId || null;

        if (!eventId) {
          throw new Error("Cannot find eventId from reservation response.");
        }

        const stallList = await getStallsByEvent(eventId);
        if (!alive) return;

        setStalls(Array.isArray(stallList) ? stallList : []);
        const initial =
          Array.isArray(resv.stallIds)
            ? resv.stallIds
            : Array.isArray(resv.stalls)
            ? resv.stalls.map((s) => s.id)
            : [];
        setSelected(initial);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load reservation.";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [id]);


  const { disabledStallIds, highlightStallIds } = useMemo(() => {
    const mine = new Set(reservationStallIds);
    const disabled = [];

    for (const s of stalls) {
      const isReserved =
        s.reserved === true ||
        s.isReserved === true ||
        (typeof s.reservationId === "number" && s.reservationId > 0) ||
        (typeof s.reservedByReservationId === "number" && s.reservedByReservationId > 0);

      if (isReserved && !mine.has(s.id)) disabled.push(s.id);
    }

    return {
      disabledStallIds: disabled,
      highlightStallIds: Array.from(mine),
    };
  }, [stalls, reservationStallIds]);

  function onToggleSelect(stallId) {
    setError("");

    setSelected((prev) => {
      const exists = prev.includes(stallId);

      if (exists) {
        return prev.filter((x) => x !== stallId);
      }

      if (prev.length >= 3) {
        setError("You can select maximum 3 stalls.");
        return prev;
      }

      return [...prev, stallId];
    });
  }

  async function onSave() {
    setError("");

    if (selected.length < 1) {
      setError("Select at least 1 stall.");
      return;
    }
    if (selected.length > 3) {
      setError("You can select maximum 3 stalls.");
      return;
    }

    try {
      setSaving(true);
      await updateReservation(id, { stallIds: selected });

      // success
      toast.success("Reservation updated successfully.");
      navigate("/me", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to update reservation.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading text="Loading reservation..." />;

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]">
            Edit Reservation
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Reservation ID: <span className="font-semibold">{id}</span>
            {reservationEventId ? (
              <>
                {" "}
                • Event: <span className="font-semibold">{reservationEventId}</span>
              </>
            ) : null}
          </p>
        </div>

        <button
          onClick={() => navigate("/me")}
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
            highlightStallIds={highlightStallIds}
            onToggleSelect={onToggleSelect}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="p-4 bg-white border rounded-2xl">
            <h2 className="text-lg font-semibold text-[var(--color-dark)]">
              Selection
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Selected stalls:{" "}
              <span className="font-semibold">{selected.length}</span> / 3
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
              onClick={onSave}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Note: Reserved stalls (grey) cannot be selected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
