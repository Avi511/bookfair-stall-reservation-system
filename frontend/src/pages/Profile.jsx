import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyReservations, cancelReservation } from "../api/reservations.api";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [cancelingId, setCancelingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        const data = await getMyReservations();
        if (!alive) return;
        setReservations(Array.isArray(data) ? data : []);
      } catch (e) {
        // API errors are shown globally by axios interceptor toast handling.
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
      await cancelReservation(reservationId);
      setReservations(reservations.filter((r) => r.id !== reservationId));
      toast.success("Reservation cancelled successfully");
      setShowCancelModal(null);
    } catch (e) {
      // API errors are shown globally by axios interceptor toast handling.
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

  if (loading) return <Loading text="Loading your reservations..." />;

  if (!loading && reservations.length === 0) {
    return (
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <EmptyState
          title="No reservations"
          description="You don't have any reservations yet."
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Booked Stalls</h1>
        <p className="text-gray-600 mt-2">
          View and manage your stall reservations
        </p>
      </div>

      <div className="space-y-6">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-blue-100">Reservation ID</div>
                    <div className="text-2xl font-bold text-white">
                      #{reservation.id}
                    </div>
                  </div>
                  <div className="h-12 w-px bg-blue-400"></div>
                  <div>
                    <div className="text-sm text-blue-100">Event</div>
                    <div className="text-lg font-semibold text-white">
                      {reservation.eventName || `Event #${reservation.eventId}`}
                    </div>
                  </div>
                </div>
                {reservation.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reservation.status)}`}
                  >
                    {reservation.status}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-5">
              {/* Reservation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total Stalls Booked
                  </label>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {Array.isArray(reservation.stalls)
                      ? reservation.stalls.length
                      : reservation.stallIds?.length || 0}
                  </div>
                </div>

                {reservation.price && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Price
                    </label>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                      ₹{reservation.price.toLocaleString()}
                    </div>
                  </div>
                )}

                {reservation.createdAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Booked On
                    </label>
                    <div className="mt-2 text-lg font-semibold text-gray-900">
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

              {/* Stalls List */}
              {Array.isArray(reservation.stalls) &&
              reservation.stalls.length > 0 ? (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">
                    Stall Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {reservation.stalls.map((stall) => (
                      <div
                        key={stall.id || stall.stallNumber}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {stall.name || `Stall ${stall.stallNumber}`}
                            </div>
                            {stall.stallNumber && (
                              <div className="text-sm text-gray-600 mt-1">
                                #{stall.stallNumber}
                              </div>
                            )}
                            {stall.price && (
                              <div className="text-sm font-medium text-blue-600 mt-2">
                                ₹{stall.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                          {stall.category && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {stall.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action Section */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(reservation.id)}
                disabled={cancelingId === reservation.id}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelingId === reservation.id
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Cancel Reservation?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel reservation #{showCancelModal}?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelReservation(showCancelModal)}
                disabled={cancelingId === showCancelModal}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
