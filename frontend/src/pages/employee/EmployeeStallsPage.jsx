import React from "react";
import { Link } from "react-router-dom";
import EmployeeStallEditor from "../../components/employee/EmployeeStallEditor";

export default function EmployeeStallsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-6xl px-4 pt-6 mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            to="/employee/stalls"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white"
          >
            Stall Layout
          </Link>
          <Link
            to="/employee/events"
            className="px-3 py-1.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
          >
            Events
          </Link>
        </div>
      </div>
      <EmployeeStallEditor />
    </div>
  );
}
