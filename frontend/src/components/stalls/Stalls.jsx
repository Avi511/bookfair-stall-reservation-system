import React from "react";

export default function Stall({
  stall,
  isDisabled,
  isSelected,
  isHighlighted,
  onClick,
}) {
  // Basic sizes (adjust as you want)
  const sizeClass =
    stall.size === "LARGE"
      ? "w-16 h-16"
      : stall.size === "MEDIUM"
      ? "w-14 h-14"
      : "w-12 h-12";

  // Priority of colors:
  // disabled (reserved by others) > selected > highlighted (mine) > normal
  let bgClass = "bg-white";
  let borderClass = "border-gray-300";

  if (isDisabled) {
    bgClass = "bg-gray-200";
    borderClass = "border-gray-300";
  } else if (isSelected) {
    bgClass = "bg-[var(--color-primary)] text-white";
    borderClass = "border-[var(--color-primary)]";
  } else if (isHighlighted) {
    bgClass = "bg-purple-200";
    borderClass = "border-purple-400";
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={[
        "absolute rounded-xl border flex items-center justify-center font-semibold text-xs shadow-sm",
        "transition-all select-none",
        sizeClass,
        bgClass,
        borderClass,
        isDisabled ? "cursor-not-allowed opacity-80" : "hover:scale-[1.02]",
      ].join(" ")}
      style={{
        left: stall.xPosition ?? stall.x ?? 0,
        top: stall.yPosition ?? stall.y ?? 0,
      }}
      title={`${stall.stallCode || stall.code || "STALL"} ${
        stall.size ? `(${stall.size})` : ""
      }`}
    >
      {stall.stallCode || stall.code || stall.id}
    </button>
  );
}
