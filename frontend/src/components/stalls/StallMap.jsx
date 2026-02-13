import React from "react";
import Stall from "./Stall";

export default function StallMap({
  stalls = [],
  selectedStallIds = [],
  disabledStallIds = [],
  highlightStallIds = [],
  onToggleSelect,
  readOnly = false,
}) {
  const selectedSet = new Set(selectedStallIds);
  const disabledSet = new Set(disabledStallIds);
  const highlightSet = new Set(highlightStallIds);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <span className="px-2 py-1 bg-gray-200 rounded-full">Reserved</span>
        <span className="px-2 py-1 bg-purple-200 rounded-full">My stalls</span>
        <span className="px-2 py-1 rounded-full bg-[var(--color-primary)] text-white">
          Selected
        </span>
      </div>

      <div className="relative w-full min-h-[520px] rounded-2xl border bg-[var(--color-accent)] overflow-hidden">
        {stalls.map((stall) => {
          const id = stall.id;
          const isDisabled = disabledSet.has(id);
          const isSelected = selectedSet.has(id);
          const isHighlighted = highlightSet.has(id);

          return (
            <Stall
              key={id}
              stall={stall}
              isDisabled={isDisabled}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              onClick={() => {
                if (readOnly) return;
                if (isDisabled) return;
                if (typeof onToggleSelect === "function") onToggleSelect(id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
