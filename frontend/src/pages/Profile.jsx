import React, { useEffect, useState } from 'react';
import { getMyReservations } from '../api/reservations.api';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        setError('');
        const data = await getMyReservations();
        if (!alive) return;
        setReservations(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load reservations');
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, []);

  if (loading) return <Loading text="Loading your reservations..." />;

  if (!loading && reservations.length === 0) {
    return (
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <EmptyState title="No reservations" description="You don't have any reservations yet." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-6 mx-auto">
      <h1 className="text-2xl font-bold">My Reservations</h1>
      {error && <div className="mt-4 text-sm text-red-700 rounded-xl bg-red-50 p-3">{error}</div>}

      <div className="mt-6 space-y-4">
        {reservations.map((r) => (
          <div key={r.id} className="p-4 bg-white border rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Reservation #{r.id}</div>
                <div className="text-sm text-gray-600">Event: {r.eventName || r.eventId}</div>
              </div>
              <div className="text-sm text-gray-500">Stalls: {Array.isArray(r.stalls) ? r.stalls.length : r.stallIds?.length || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
