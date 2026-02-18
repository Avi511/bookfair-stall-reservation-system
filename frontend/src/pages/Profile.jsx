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
        <p className="mt-2 text-gray-600">
          View and manage your stall reservations
        </p>
      </div>

      <div className="space-y-6">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
          >
            
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-blue-100">Reservation ID</div>
                    <div className="text-2xl font-bold text-white">
                      #{reservation.id}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-blue-400"></div>
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

            
            <div className="px-6 py-5">
              
              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
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
                    <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Total Price
                    </label>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                      ₹{reservation.price.toLocaleString()}
                    </div>
                  </div>
                )}

                {reservation.createdAt && (
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
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

              
              {Array.isArray(reservation.stalls) &&
              reservation.stalls.length > 0 ? (
                <div>
                  <label className="block mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Stall Details
                  </label>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {reservation.stalls.map((stall) => (
                      <div
                        key={stall.id || stall.stallNumber}
                        className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {stall.name || `Stall ${stall.stallNumber}`}
                            </div>
                            {stall.stallNumber && (
                              <div className="mt-1 text-sm text-gray-600">
                                #{stall.stallNumber}
                              </div>
                            )}
                            {stall.price && (
                              <div className="mt-2 text-sm font-medium text-blue-600">
                                ₹{stall.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                          {stall.category && (
                            <span className="px-2 py-1 ml-2 text-xs font-medium text-blue-800 bg-blue-100 rounded">
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

            
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
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
          </div>
        ))}
      </div>

      
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
