import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StallMap from "../../../components/stalls/StallMap";
import { getActiveEvent } from "../../../api/events.api";
import { getStallsByEvent } from "../../../api/stalls.api";
import { useAuth } from "../../../auth/AuthContext";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated;

  const [mapStalls, setMapStalls] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  const [showGenrePrompt, setShowGenrePrompt] = useState(false);
  const [genrePromptReservationId, setGenrePromptReservationId] = useState(null);

  /* ================= LOAD MAP PREVIEW ================= */
  useEffect(() => {
    let alive = true;

    if (!isLoggedIn) return () => (alive = false);

    const loadMap = async () => {
      try {
        setMapLoading(true);
        setMapError("");

        const active = await getActiveEvent();
        const activeEvent = Array.isArray(active) ? active[0] : active;
        const eventId = Number(activeEvent?.id) || null;

        if (!eventId) throw new Error("No active event available.");

        const stalls = await getStallsByEvent(eventId);
        if (!alive) return;

        setMapStalls(Array.isArray(stalls) ? stalls : []);
      } catch (e) {
        if (!alive) return;

        const raw =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load map.";

        const text = String(raw || "").toLowerCase();

        setMapError(
          text.includes("active")
            ? "No active event map is available right now."
            : "Map preview is temporarily unavailable."
        );
      } finally {
        if (alive) setMapLoading(false);
      }
    };

    loadMap();
    return () => (alive = false);
  }, [isLoggedIn]);

  /* ================= HANDLE GENRE POPUP ================= */
  useEffect(() => {
    if (!location.state?.showGenrePrompt) return;

    const rid = Number(location.state?.reservationId);

    setShowGenrePrompt(true);
    setGenrePromptReservationId(
      Number.isFinite(rid) && rid > 0 ? rid : null
    );

    // clear state after reading
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleAddGenres = () => {
    if (genrePromptReservationId) {
      navigate(`/genres?reservationId=${genrePromptReservationId}`);
    } else {
      navigate("/profile");
    }
  };

  /* ================= MEMO DISABLED STALLS ================= */
  const mapDisabledStallIds = useMemo(() => {
    return mapStalls
      .filter(
        (s) =>
          s.reserved === true ||
          s.isReserved === true ||
          (typeof s.reservationId === "number" && s.reservationId > 0) ||
          (typeof s.reservedByReservationId === "number" &&
            s.reservedByReservationId > 0)
      )
      .map((s) => s.id);
  }, [mapStalls]);

  return (
    <div className="bg-slate-50 text-slate-900">

      {/* ================= GENRE POPUP ================= */}
      {showGenrePrompt && (
        <div className="fixed left-1/2 top-24 z-[70] w-[min(92vw,760px)] -translate-x-1/2">
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-xl">
            <p className="text-base font-semibold text-emerald-800">
              Reservation confirmed. Add the literary genres you will display or sell at the exhibition.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddGenres}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-700"
              >
                Add Literary Genres
              </button>

              <button
                type="button"
                onClick={() => setShowGenrePrompt(false)}
                className="rounded-xl border border-emerald-300 bg-white px-6 py-2.5 text-base font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-white to-accent/10" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Colombo International Bookfair 2026
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900">
              Reserve your stall in Sri Lanka&apos;s largest book exhibition
            </h1>

            <p className="mt-5 text-lg text-slate-600">
              A modern reservation platform for publishers and vendors to book
              stalls, manage confirmations, and receive QR-based entry passes
              for the exhibition.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 text-white font-semibold shadow-sm hover:brightness-110"
                >
                  Get started
                </Link>
              )}

              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:border-slate-400"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur border border-slate-200 p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              What you can do
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Register your business and reserve stalls online.</li>
              <li>• View a venue map with real-time availability.</li>
              <li>• Receive confirmation email with QR entry pass.</li>
              <li>• Add literary genres to personalize your profile.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= MAP PREVIEW ================= */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Venue map preview
          </h2>

          {!isLoggedIn && (
            <p className="mt-6 text-sm text-slate-600">
              Login to view the live stall map.
            </p>
          )}

          {isLoggedIn && mapError && (
            <div className="px-3 py-2 mt-6 text-sm text-red-700 rounded-lg bg-red-50">
              {mapError}
            </div>
          )}

          {isLoggedIn && !mapError && mapLoading && (
            <p className="mt-6 text-sm text-slate-600">
              Loading map preview...
            </p>
          )}

          {isLoggedIn && !mapError && !mapLoading && (
            <div className="mt-6">
              <StallMap
                stalls={mapStalls}
                selectedStallIds={[]}
                disabledStallIds={mapDisabledStallIds}
                highlightStallIds={[]}
                readOnly
              />

              <div className="mt-3">
                <Link
                  to="/stall-map"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold border rounded-xl bg-white hover:bg-slate-50"
                >
                  Open Full Map
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
