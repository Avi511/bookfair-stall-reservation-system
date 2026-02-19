import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StallMap from "../../../components/stalls/StallMap";
import { getActiveEvent } from "../../../api/events.api";
import { getStallsByEvent } from "../../../api/stalls.api";
import { useAuth } from "../../../auth/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated;

  const [eventName, setEventName] = useState("Book Fair Event");
  const [mapStalls, setMapStalls] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");
  const [showGenrePrompt, setShowGenrePrompt] = useState(false);
  const [postReservationId, setPostReservationId] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadMap = async () => {
      try {
        setMapLoading(true);
        setMapError("");

        const active = await getActiveEvent();
        const activeEvent = Array.isArray(active) ? active[0] : active;

        if (!alive) return;

        const resolvedEventName = String(activeEvent?.name || "").trim();
        setEventName(resolvedEventName || "Book Fair Event");

        const eventId = Number(activeEvent?.id) || null;
        if (!eventId) {
          setMapStalls([]);
          setMapError("No active event map is available right now.");
          return;
        }

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
            : "Map preview is temporarily unavailable.",
        );
      } finally {
        if (alive) setMapLoading(false);
      }
    };

    loadMap();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const shouldShowPrompt =
      sessionStorage.getItem("showGenrePromptAfterReservation") === "1";

    if (shouldShowPrompt) {
      setShowGenrePrompt(true);
      setPostReservationId(sessionStorage.getItem("postReservationId"));
      sessionStorage.removeItem("showGenrePromptAfterReservation");
      sessionStorage.removeItem("postReservationId");
    }
  }, []);

  const mapDisabledStallIds = useMemo(() => {
    return mapStalls
      .filter(
        (s) =>
          s.reserved === true ||
          s.isReserved === true ||
          (typeof s.reservationId === "number" && s.reservationId > 0) ||
          (typeof s.reservedByReservationId === "number" &&
            s.reservedByReservationId > 0),
      )
      .map((s) => s.id);
  }, [mapStalls]);

  const onAddGenresYes = () => {
    const reservationId = Number(postReservationId);
    setShowGenrePrompt(false);
    if (reservationId) {
      navigate(`/genres?reservationId=${reservationId}`);
      return;
    }
    navigate("/genres");
  };

  const onAddGenresNo = () => {
    setShowGenrePrompt(false);
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-white to-accent/10" />
        <div className="relative grid items-center max-w-6xl gap-12 px-4 py-16 mx-auto md:py-24 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-accent">
              {eventName}
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl text-slate-900">
              Reserve your stall in Sri Lanka&apos;s largest book exhibition
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              A modern reservation platform for publishers and vendors to book
              stalls, manage confirmations, and receive QR-based entry passes
              for the exhibition.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-lg shadow-sm bg-secondary hover:brightness-110"
                >
                  Get started
                </Link>
              )}
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold border rounded-lg border-slate-300 text-slate-700 hover:border-slate-400"
              >
                Learn more
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8 text-sm text-slate-600">
              <div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p>Maximum stalls per business</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">A-Z</p>
                <p>Alphabetical stall naming</p>
              </div>
            </div>
          </div>
          <div className="p-8 border shadow-lg rounded-2xl bg-white/90 backdrop-blur border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              What you can do
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Register your business and reserve stalls online.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                View a venue map with real-time availability.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Receive confirmation email with QR entry pass.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Add literary genres to personalize your profile.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl px-4 mx-auto py-14">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Stall categories",
              description:
                "Choose from small, medium, and large stalls based on your display needs.",
            },
            {
              title: "Smart confirmations",
              description:
                "Pop-up confirmation and automated email notifications keep your team updated.",
            },
            {
              title: "Organizer portal",
              description:
                "Authorized staff can review availability, reservations, and daily updates.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl px-4 mx-auto py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold md:text-3xl text-slate-900">
                Reserve a stall in four simple steps
              </h2>
              <p className="mt-3 text-slate-600">
                Built to reduce manual handling and ensure every reservation is
                verified, confirmed, and ready for the exhibition day.
              </p>
            </div>
            <div className="grid flex-1 gap-4">
              {[
                {
                  step: "1",
                  title: "Register your business",
                  text: "Create an account and submit business details for verification.",
                },
                {
                  step: "2",
                  title: "Select stall(s)",
                  text: "Pick up to three available stalls from the venue map.",
                },
                {
                  step: "3",
                  title: "Confirm reservation",
                  text: "Review the summary and confirm via the pop-up dialog.",
                },
                {
                  step: "4",
                  title: "Receive QR pass",
                  text: "Get an email confirmation with QR entry pass for download.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 border rounded-xl border-slate-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-secondary">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl px-4 mx-auto py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Stall sizes
            </h2>
            <p className="mt-2 text-slate-600">
              Each stall is named alphabetically and grouped by size and
              dimensions.
            </p>
            <div className="mt-6 space-y-4">
              {(() => {
                const stalls = [
                  {
                    label: "Small",
                    details:
                      "Ideal for single-title publishers or compact displays.",
                  },
                  {
                    label: "Medium",
                    details:
                      "Perfect for multi-title showcases and promotions.",
                  },
                  {
                    label: "Large",
                    details:
                      "Best for larger publishers with interactive experiences.",
                  },
                ];
                return stalls.map((stall) => (
                  <div
                    key={stall.label}
                    className="flex items-start justify-between gap-4 px-4 py-3 border rounded-lg border-slate-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {stall.label}
                      </p>
                      <p className="text-sm text-slate-600">{stall.details}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                      Available
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="p-6 border border-dashed rounded-2xl border-slate-300 bg-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">
              Venue map preview
            </h2>
            <p className="mt-2 text-slate-600">
              View the live map here. This preview is read-only.
            </p>

            {mapError && (
              <div className="px-3 py-2 mt-6 text-sm text-red-700 rounded-lg bg-red-50">
                {mapError}
              </div>
            )}

            {!mapError && mapLoading && (
              <p className="mt-6 text-sm text-slate-600">
                Loading map preview...
              </p>
            )}

            {!mapError && !mapLoading && (
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
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-white border rounded-xl hover:bg-slate-50"
                  >
                    Open Full Map
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showGenrePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add Genres</h3>
            <p className="mt-3 text-sm text-slate-700">
              Do you want to add genres to the reservation?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onAddGenresNo}
                className="px-4 py-2 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={onAddGenresYes}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-secondary hover:brightness-110"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
