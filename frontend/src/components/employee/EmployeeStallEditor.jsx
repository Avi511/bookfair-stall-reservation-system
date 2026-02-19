import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import {
  createStall,
  deleteStall as deleteStallApi,
  getAllStalls,
  updateStall,
} from "../../api/stalls.api";

const SIZE_TO_CELLS = {
  SMALL: { w: 2, h: 2 },
  MEDIUM: { w: 5, h: 3 },
  LARGE: { w: 7, h: 6 },
};

const GRID = {
  CELL: 20,
  GAP: 6,
  PAD: 10,
};

const getSessionToken = () =>
  localStorage.getItem("accessToken") || localStorage.getItem("token");

const ensureAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) return accessToken;

  const fallbackToken = localStorage.getItem("token");
  if (fallbackToken) {
    localStorage.setItem("accessToken", fallbackToken);
    return fallbackToken;
  }

  return "";
};

const extractApiError = (e, fallback) => {
  const status = e?.response?.status;
  const raw =
    e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback;
  const message = String(raw || "").toLowerCase();

  if (status === 401) {
    return "Your session expired. Please login again.";
  }
  if (status === 403) {
    return "You do not have permission to edit stalls.";
  }
  if (status >= 500) {
    return "Server error. Please try again in a moment.";
  }
  if (message.includes("overlap")) {
    return "That position overlaps another stall. Move it and try again.";
  }
  if (message.includes("not found")) {
    return "Requested stall was not found.";
  }
  if (message.includes("network")) {
    return "Network issue. Please check your connection and try again.";
  }

  return raw || fallback;
};

export default function EmployeeStallEditor() {
  const navigate = useNavigate();

  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [newCode, setNewCode] = useState("");
  const [newSize, setNewSize] = useState("SMALL");

  const [drag, setDrag] = useState(null);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const pendingMoveRef = useRef(null);
  const [scale, setScale] = useState(1);

  const [drafts, setDrafts] = useState({});
  const [activeDraftId, setActiveDraftId] = useState(null);

  const isAuthed = Boolean(getSessionToken());

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    if (!ensureAccessToken()) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const data = await getAllStalls();
      setStalls(Array.isArray(data) ? data : []);
      setDrafts({});
      setActiveDraftId(null);
    } catch (e) {
      setError(extractApiError(e, "Failed to load stalls."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const bounds = useMemo(() => {
    let maxX = 1;
    let maxY = 1;

    for (const s of stalls) {
      const dim = SIZE_TO_CELLS[s.size] || SIZE_TO_CELLS.SMALL;
      const d = drafts[s.id];
      const x = d?.x ?? s.xPosition ?? 1;
      const y = d?.y ?? s.yPosition ?? 1;

      maxX = Math.max(maxX, x + dim.w);
      maxY = Math.max(maxY, y + dim.h);
    }

    return { cols: maxX + 8, rows: maxY + 8 };
  }, [stalls, drafts]);

  const stagePx = useMemo(() => {
    const { CELL, GAP, PAD } = GRID;
    return {
      width: PAD * 2 + bounds.cols * CELL + (bounds.cols - 1) * GAP,
      height: PAD * 2 + bounds.rows * CELL + (bounds.rows - 1) * GAP,
    };
  }, [bounds]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const available = el.clientWidth;
      const needed = stagePx.width;
      if (!available || !needed) return;
      setScale(Math.min(1, Math.max(0.55, available / needed)));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [stagePx.width]);

  const rectFor = (stallId) => {
    const s = stalls.find((x) => x.id === stallId);
    if (!s) return null;

    const dim = SIZE_TO_CELLS[s.size] || SIZE_TO_CELLS.SMALL;
    const d = drafts[stallId];
    const x = d?.x ?? s.xPosition;
    const y = d?.y ?? s.yPosition;
    return { x, y, w: dim.w, h: dim.h };
  };

  const overlaps = (a, b) =>
    !(
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y
    );

  const canPlace = (movingId, nextRect) => {
    for (const s of stalls) {
      if (s.id === movingId) continue;
      const r = rectFor(s.id);
      if (r && overlaps(nextRect, r)) return false;
    }
    return true;
  };

  const gridToPx = (x, y) => {
    const { CELL, GAP, PAD } = GRID;
    return {
      left: PAD + (x - 1) * (CELL + GAP),
      top: PAD + (y - 1) * (CELL + GAP),
    };
  };

  const currentXY = (s) => {
    const d = drafts[s.id];
    return {
      x: d?.x ?? s.xPosition,
      y: d?.y ?? s.yPosition,
    };
  };

  const stallStyle = (s) => {
    const { CELL, GAP } = GRID;
    const dim = SIZE_TO_CELLS[s.size] || SIZE_TO_CELLS.SMALL;
    const { x, y } = currentXY(s);
    const { left, top } = gridToPx(x, y);
    const isDraft = Boolean(drafts[s.id]);

    return {
      position: "absolute",
      left,
      top,
      width: dim.w * CELL + (dim.w - 1) * GAP,
      height: dim.h * CELL + (dim.h - 1) * GAP,
      cursor: "grab",
      zIndex: isDraft ? 5 : 1,
    };
  };

  const clearDraft = (id) => {
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeDraftId === id) setActiveDraftId(null);
  };

  const confirmDraft = async (id) => {
    const d = drafts[id];
    if (!d) return;

    if (!ensureAccessToken()) {
      setError("Please login first.");
      return;
    }

    const stall = stalls.find((x) => x.id === id);
    if (!stall) return;

    const nextRect = { ...rectFor(id) };
    if (!canPlace(id, nextRect)) {
      setError("Overlap detected. Cannot confirm.");
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], saving: true },
    }));
    setSaving(true);

    try {
      await updateStall(id, {
        stallCode: stall.stallCode,
        size: stall.size,
        xPosition: d.x,
        yPosition: d.y,
      });

      setStalls((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, xPosition: d.x, yPosition: d.y } : x,
        ),
      );
      clearDraft(id);
      toast.success(`Saved ${stall.stallCode} at (${d.x}, ${d.y}).`);
      setError("");
    } catch (e) {
      setError(extractApiError(e, "Update failed."));
      setDrafts((prev) => ({
        ...prev,
        [id]: { ...prev[id], saving: false },
      }));
    } finally {
      setSaving(false);
    }
  };

  const cancelDraft = (id) => {
    if (!drafts[id]) return;
    clearDraft(id);
    toast.success("Draft canceled.");
    setError("");
  };

  const onMouseDown = async (e, s) => {
    setError("");

    if (activeDraftId && activeDraftId !== s.id) {
      await confirmDraft(activeDraftId);
    }

    setDrafts((prev) => {
      if (prev[s.id]) return prev;
      return {
        ...prev,
        [s.id]: {
          x: s.xPosition,
          y: s.yPosition,
          originalX: s.xPosition,
          originalY: s.yPosition,
          saving: false,
        },
      };
    });

    setActiveDraftId(s.id);
    setDrag({
      id: s.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: drafts[s.id]?.x ?? s.xPosition,
      startY: drafts[s.id]?.y ?? s.yPosition,
    });
  };

  const onMouseMove = useCallback((e) => {
    if (!drag) return;

    const step = GRID.CELL + GRID.GAP;
    const moveX = Math.round((e.clientX - drag.startMouseX) / step);
    const moveY = Math.round((e.clientY - drag.startMouseY) / step);
    const newX = Math.max(1, drag.startX + moveX);
    const newY = Math.max(1, drag.startY + moveY);

    const dim = SIZE_TO_CELLS[stalls.find((x) => x.id === drag.id)?.size] || {
      w: 2,
      h: 2,
    };
    const nextRect = { x: newX, y: newY, w: dim.w, h: dim.h };
    if (!canPlace(drag.id, nextRect)) return;

    pendingMoveRef.current = { newX, newY };
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      const move = pendingMoveRef.current;
      rafRef.current = null;
      if (!move) return;
      setDrafts((prev) => ({
        ...prev,
        [drag.id]: {
          ...(prev[drag.id] || {}),
          x: move.newX,
          y: move.newY,
          saving: prev[drag.id]?.saving ?? false,
          originalX: prev[drag.id]?.originalX ?? drag.startX,
          originalY: prev[drag.id]?.originalY ?? drag.startY,
        },
      }));
    });
  }, [canPlace, drag, stalls]);

  const onMouseUp = useCallback(() => {
    if (!drag) return;
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingMoveRef.current = null;
    setDrag(null);
  }, [drag]);

  useEffect(() => {
    if (!drag) return undefined;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [drag, onMouseMove, onMouseUp]);

  const addStall = async () => {
    setError("");

    const code = newCode.trim();
    if (!code) {
      setError("Enter stall code.");
      return;
    }

    if (!ensureAccessToken()) {
      setError("Please login first.");
      return;
    }

    const dim = SIZE_TO_CELLS[newSize] || SIZE_TO_CELLS.SMALL;
    let found = null;

    for (let y = 1; y < bounds.rows; y++) {
      for (let x = 1; x < bounds.cols; x++) {
        const rect = { x, y, w: dim.w, h: dim.h };
        if (canPlace(null, rect)) {
          found = { x, y };
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      setError("No space available. Rearrange stalls or increase map area.");
      return;
    }

    setSaving(true);
    try {
      const created = await createStall({
        stallCode: code,
        size: newSize,
        xPosition: found.x,
        yPosition: found.y,
      });

      if (created?.id) {
        setStalls((prev) => [...prev, created]);
      } else {
        await fetchAll();
      }

      toast.success(`Added ${code} (${newSize}).`);
      setNewCode("");
    } catch (e) {
      setError(extractApiError(e, "Create failed."));
    } finally {
      setSaving(false);
    }
  };

  const deleteStall = async (id) => {
    setError("");

    if (!ensureAccessToken()) {
      setError("Please login first.");
      return;
    }

    setSaving(true);
    try {
      await deleteStallApi(id);
      setStalls((prev) => prev.filter((s) => s.id !== id));
      clearDraft(id);
      toast.success("Deleted stall.");
    } catch (e) {
      setError(extractApiError(e, "Delete failed."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading stalls..." />;

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]">Edit Stall Layout</h1>
          <p className="mt-1 text-sm text-gray-600">
            Drag stalls to move them. Click confirm to save one stall at a time.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {!isAuthed && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
          Please login first.
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            className="relative w-full overflow-auto border rounded-2xl bg-[var(--color-accent)] p-3"
          >
            <div
              style={{
                width: stagePx.width,
                height: stagePx.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <div
                ref={stageRef}
                className="relative rounded-xl"
                style={{
                  width: stagePx.width,
                  height: stagePx.height,
                  backgroundImage: `
                    linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: `${GRID.CELL + GRID.GAP}px ${GRID.CELL + GRID.GAP}px`,
                  backgroundPosition: `${GRID.PAD}px ${GRID.PAD}px`,
                }}
              >
                {stalls.map((s) => {
                  const d = drafts[s.id];
                  const isDraft = Boolean(d);

                  return (
                    <div
                      key={s.id}
                      style={stallStyle(s)}
                      onMouseDown={(e) => onMouseDown(e, s)}
                      className={[
                        "absolute rounded-xl border shadow-sm select-none px-2 py-1.5",
                        "flex flex-col items-center justify-center text-xs",
                        isDraft
                          ? "border-blue-400 bg-blue-100"
                          : "border-emerald-300 bg-emerald-50",
                      ].join(" ")}
                      title="Drag to move"
                    >
                      <div className="font-bold">{s.stallCode}</div>
                      <div className="text-[11px] text-gray-600">{s.size}</div>
                      <div className="text-[11px] text-gray-500">
                        ({d?.x ?? s.xPosition}, {d?.y ?? s.yPosition})
                      </div>

                      {isDraft && (
                        <div className="flex gap-1 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDraft(s.id);
                            }}
                            disabled={d?.saving || saving}
                            className="px-2 py-1 text-[11px] text-blue-700 bg-blue-200 border border-blue-300 rounded-lg disabled:opacity-60"
                          >
                            {d?.saving ? "Saving..." : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelDraft(s.id);
                            }}
                            disabled={d?.saving || saving}
                            className="px-2 py-1 text-[11px] text-gray-700 bg-gray-200 border border-gray-300 rounded-lg disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStall(s.id);
                        }}
                        disabled={saving}
                        className="px-2 py-1 mt-1 text-[11px] text-red-700 bg-red-100 border border-red-300 rounded-lg disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-4 bg-white border rounded-2xl">
            <h2 className="text-lg font-semibold text-[var(--color-dark)]">Add New Stall</h2>
            <p className="mt-1 text-sm text-gray-600">
              Existing stalls: <span className="font-semibold">{stalls.length}</span>
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Stall Code</label>
              <input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="ex: S12"
                className="w-full px-3 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="SMALL">SMALL</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LARGE">LARGE</option>
              </select>
            </div>

            <button
              onClick={addStall}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Working..." : "Add Stall"}
            </button>

            <button
              onClick={fetchAll}
              disabled={saving}
              className="w-full py-2 mt-2 font-semibold border rounded-xl hover:bg-gray-50 disabled:opacity-60"
            >
              Refresh Map
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Tip: drag a stall, then press confirm to persist its new position.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
