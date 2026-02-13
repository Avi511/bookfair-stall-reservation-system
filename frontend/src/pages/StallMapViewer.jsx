import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StallMap from "../components/stalls/StallMap";
import Loading from "../components/common/Loading";
import { getStallsByEvent } from "../api/stalls.api";

export default function StallMapViewer() {
  const { eventId } = useParams();
  const eventIdValue = useMemo(() => Number(eventId) || null, [eventId]);

  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!eventIdValue) {
        setError("Invalid event id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getStallsByEvent(eventIdValue);
        if (!alive) return;
        setStalls(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
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
  }, [eventIdValue]);

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

      <p className="mt-1 text-sm text-gray-600">
        Event ID: <span className="font-semibold">{eventIdValue ?? "-"}</span>
      </p>

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
