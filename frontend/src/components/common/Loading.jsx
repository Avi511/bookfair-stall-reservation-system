import React from "react";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="px-6 py-4 bg-white border shadow-sm rounded-2xl">
        <p className="text-sm text-gray-700">{text}</p>
      </div>
    </div>
  );
}
