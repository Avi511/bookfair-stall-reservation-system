import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StallMap from "../components/stalls/StallMap";
import Loading from "../components/common/Loading";
import { getStallsByEvent } from "../api/stalls.api";
import { getActiveEvent } from "../api/events.api";

export default function StallMapViewer() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");
        const active = await getActiveEvent();
        const activeEvent = Array.isArray(active) ? active[0] : active;
        const activeEventId = Number(activeEvent?.id) || null;
        if (!activeEventId) {
          throw new Error("No active event available.");
        }

        const data = await getStallsByEvent(activeEventId);
        if (!alive) return;
        setStalls(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        const raw =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load stalls.";
        const text = String(raw || "").toLowerCase();
        const msg = text.includes("active")
          ? "No active event is available right now."
          : "Unable to load the map right now. Please try again.";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const disabledStallIds = useMemo(() => {
    return stalls
      .filter(
        (s) =>
          s.reserved === true ||
          s.isReserved === true ||
          (typeof s.reservationId === "number" && s.reservationId > 0) ||
          (typeof s.reservedByReservationId === "number" && s.reservedByReservationId > 0)
      )
      .map((s) => s.id);
  }, [stalls]);

  if (loading) return <Loading text="Loading map..." />;

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">Stall Map Viewer</h1>
        <Link to="/" className="px-4 py-2 border rounded-xl hover:bg-gray-50">
          Home
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      <div className="mt-6">
        <StallMap
          stalls={stalls}
          selectedStallIds={[]}
          disabledStallIds={disabledStallIds}
          highlightStallIds={[]}
          readOnly
        />
      </div>
    </div>
  );
}
