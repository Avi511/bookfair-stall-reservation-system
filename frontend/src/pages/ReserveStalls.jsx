import React from "react";
import { Navigate, Link } from "react-router-dom";

export default function ReserveStalls() {
  const hasToken =
    Boolean(localStorage.getItem("token")) ||
    Boolean(localStorage.getItem("accessToken"));

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Reserve Stall</h1>
        <p className="mt-3 text-slate-600">
          You are logged in and can now continue to stall reservation.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-slate-700 font-semibold hover:border-slate-400"
          >
            Back to Home
          </Link>
          <Link
            to="/me"
            className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-2.5 text-white font-semibold hover:brightness-110"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
