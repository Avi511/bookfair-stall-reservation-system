import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-lg p-8 bg-white shadow rounded-2xl text-center">
        <h1 className="text-4xl font-bold text-[var(--color-dark)]">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <p className="mt-4 text-sm text-gray-500">The page you are looking for does not exist.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2 bg-[var(--color-primary)] text-white rounded-xl">Go to Home</Link>
      </div>
    </div>
  );
}
