import React from "react";

export default function Alert({ type = "info", children }) {
  const styles = {
    error: "px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50 border border-red-200",
    success: "px-4 py-3 mt-4 text-sm text-emerald-700 rounded-xl bg-emerald-50 border border-emerald-200",
    info: "px-4 py-3 mt-4 text-sm text-blue-800 rounded-xl bg-blue-50 border border-blue-200",
    warning: "px-4 py-3 mt-4 text-sm text-yellow-800 rounded-xl bg-yellow-50 border border-yellow-200",
  };

  const cls = styles[type] || styles.info;
  return <div className={cls}>{children}</div>;
}
