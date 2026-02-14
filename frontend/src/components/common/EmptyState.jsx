import React from 'react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="p-8 text-center border rounded-2xl bg-white">
      <h3 className="text-lg font-semibold text-[var(--color-dark)]">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
