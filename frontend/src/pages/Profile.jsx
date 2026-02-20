import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { getMyReservations, cancelReservation } from "../api/reservations.api";
import { getGenresByReservation } from "../api/genres.api";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [genresByReservation, setGenresByReservation] = useState({});
  const [cancelingId, setCancelingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { user } = useAuth();
  const userEmail = user?.payload?.email || user?.payload?.sub || "User";
  const userName = user?.payload?.name || "My Account";

  const loadReservationGenres = async (reservationList) => {
    const ids = (Array.isArray(reservationList) ? reservationList : [])
      .map((r) => Number(r?.id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (ids.length === 0) {
      setGenresByReservation({});
      return;
    }

    const pairs = await Promise.all(
      ids.map(async (id) => {
        try {
          const data = await getGenresByReservation(id);
          const names = (Array.isArray(data) ? data : [])
            .map((g) => g?.name || g?.genre)
            .filter(Boolean);
          return [id, names];
        } catch {
          return [id, []];
        }
      }),
    );

    setGenresByReservation(Object.fromEntries(pairs));
  };

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        const data = await getMyReservations();
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        setReservations(list);
        await loadReservationGenres(list);
      } catch (e) {
        if (!e?.response) {
          toast.error(e?.message || "Failed to load reservations");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, []);

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancelingId(reservationId);
      const updated = await cancelReservation(reservationId);
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? {
                ...reservation,
                ...(updated && typeof updated === "object" ? updated : {}),
                status: "CANCELLED",
              }
            : reservation,
        ),
      );
      toast.success("Reservation cancelled successfully");
      setShowCancelModal(null);
    } catch (e) {
      if (!e?.response) {
        toast.error(e?.message || "Failed to cancel reservation");
      }
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "confirmed":
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusOrder = (status) => {
    const value = String(status || "").toUpperCase();
    if (value === "CONFIRMED" || value === "ACTIVE") return 0;
    if (value === "PENDING") return 1;
    if (value === "CANCELLED" || value === "CANCELED") return 99;
    return 2;
  };

  const sortReservationsByStatus = (a, b) => {
    const byStatus = getStatusOrder(a?.status) - getStatusOrder(b?.status);
    if (byStatus !== 0) return byStatus;
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    return bTime - aTime;
  };

  const sortedReservations = useMemo(() => {
    const list = Array.isArray(reservations) ? [...reservations] : [];
    return list.sort(sortReservationsByStatus);
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    if (statusFilter === "ALL") return sortedReservations;
    return sortedReservations.filter((reservation) => {
      const status = String(reservation?.status || "").toUpperCase();
      if (statusFilter === "CANCELLED") {
        return status === "CANCELLED" || status === "CANCELED";
      }
      return status === statusFilter;
    });
  }, [sortedReservations, statusFilter]);

  const getReservationStalls = (reservation) => {
    const stalls = Array.isArray(reservation?.stalls) ? reservation.stalls : [];
    if (stalls.length > 0) {
      return stalls.map((stall, index) => ({
        id:
          stall?.id ||
          stall?.stallNumber ||
          stall?.stallCode ||
          `stall-${index}`,
        label:
          stall?.stallCode ||
          stall?.name ||
          stall?.code ||
          (stall?.stallNumber ? `Stall ${stall.stallNumber}` : null) ||
          (stall?.id ? `Stall ${stall.id}` : null) ||
          "Stall",
        number: stall?.stallNumber || stall?.id || null,
        price: stall?.price || null,
        category: stall?.category || null,
      }));
    }

    const ids = Array.isArray(reservation?.stallIds)
      ? reservation.stallIds
      : [];
    return ids.map((id, index) => ({
      id: id || `stall-id-${index}`,
      label: `Stall ${id}`,
      number: id,
      price: null,
      category: null,
    }));
  };

  if (loading) return <Loading text="Loading your reservations..." />;

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Booked Stalls</h1>
        <p className="mt-2 text-gray-600">
          View and manage your stall reservations
        </p>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-[1fr_auto]">
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  Account
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {userName}
                </div>
                <div className="text-xs text-gray-600">{userEmail}</div>
              </div>
            </div>
            <Link
              to="/change-password"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Link>
          </div>
        </div>
      </div>

      <div className="grid items-end gap-4 p-4 mb-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div>
          <label className="block mb-2 text-base font-semibold text-gray-800">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border-2 border-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="max-w-4xl px-4 py-6 mx-auto">
          <EmptyState
            title="No reservations"
            description="You don't have any reservations yet."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredReservations.map((reservation) => {
            const stallList = getReservationStalls(reservation);
            const selectedGenres = genresByReservation[reservation.id] || [];
            const isCancelled =
              String(reservation?.status || "").toUpperCase() === "CANCELLED";

            return (
              <div
                key={reservation.id}
                className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs text-blue-100">
                          Reservation ID
                        </div>
                        <div className="text-xl font-bold text-white">
                          #{reservation.id}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-blue-400"></div>
                      <div>
                        <div className="text-xs text-blue-100">Event</div>
                        <div className="text-base font-semibold text-white">
                          {reservation.eventName ||
                            `Event #${reservation.eventId}`}
                        </div>
                      </div>
                    </div>
                    {reservation.status && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-4 py-4">
                  <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Total Stalls Booked
                      </label>
                      <div className="mt-1 text-xl font-bold text-gray-900">
                        {stallList.length}
                      </div>
                    </div>

                    {reservation.createdAt && (
                      <div>
                        <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Booked On
                        </label>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          {new Date(reservation.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {stallList.length > 0 ? (
                    <div>
                      <label className="block mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Stall Details
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {stallList.map((stall) => (
                          <div
                            key={stall.id}
                            className="p-2 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div className="font-semibold text-gray-900">
                              {stall.label}
                            </div>
                            {stall.number && (
                              <div className="mt-1 text-sm text-gray-600">
                                #{stall.number}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <label className="block mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Selected Genres
                    </label>
                    {selectedGenres.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No genres selected
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedGenres.map((genre, index) => (
                          <span
                            key={`${reservation.id}-genre-${index}`}
                            className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {!isCancelled && (
                  <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowCancelModal(reservation.id)}
                      disabled={cancelingId === reservation.id}
                      className="px-4 py-2 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelingId === reservation.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Cancel Reservation?
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel reservation #{showCancelModal}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelReservation(showCancelModal)}
                disabled={cancelingId === showCancelModal}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelingId === showCancelModal
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
