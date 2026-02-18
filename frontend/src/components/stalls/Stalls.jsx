import React from "react";

const GRID = {
  CELL: 24,
  GAP: 8,
  PAD: 12,
};

const SIZE_TO_CELLS = {
  SMALL: { w: 2, h: 2 },
  MEDIUM: { w: 5, h: 3 },
  LARGE: { w: 7, h: 6 },
};

export default function Stall({
  stall,
  isDisabled,
  isSelected,
  isHighlighted,
  onClick,
}) {
  const dim = SIZE_TO_CELLS[stall.size] || SIZE_TO_CELLS.SMALL;
  const gridX = Math.max(1, Number(stall.xPosition ?? stall.x ?? 1));
  const gridY = Math.max(1, Number(stall.yPosition ?? stall.y ?? 1));

  const left = GRID.PAD + (gridX - 1) * (GRID.CELL + GRID.GAP);
  const top = GRID.PAD + (gridY - 1) * (GRID.CELL + GRID.GAP);
  const width = dim.w * GRID.CELL + (dim.w - 1) * GRID.GAP;
  const height = dim.h * GRID.CELL + (dim.h - 1) * GRID.GAP;

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
        bgClass,
        borderClass,
        isDisabled ? "cursor-not-allowed opacity-80" : "hover:scale-[1.02]",
      ].join(" ")}
      style={{
        left,
        top,
        width,
        height,
      }}
      title={`${stall.stallCode || stall.code || "STALL"} ${
        stall.size ? `(${stall.size})` : ""
      }`}
    >
      {stall.stallCode || stall.code || stall.id}
    </button>
  );
}
