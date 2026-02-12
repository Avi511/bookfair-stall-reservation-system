import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "http://localhost:8080";

const EMPLOYEE_SMALL_VISUAL_SCALE = 2;

const SIZE_TO_CELLS = {
  SMALL: { w: 2, h: 2 },
  MEDIUM: { w: 5, h: 3 },
  LARGE: { w: 7, h: 6 },
};

const GRID = {
  CELL: 24, // ✅ bigger than viewer
  GAP: 8, // ✅ optional
  PAD: 12,
};

export default function EmployeeStallEditor() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [newCode, setNewCode] = useState("");
  const [newSize, setNewSize] = useState("SMALL");

  const [drag, setDrag] = useState(null);
  const stageRef = useRef(null);

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // ✅ Draft system
  // drafts[id] = { x, y, originalX, originalY, saving: boolean }
  const [drafts, setDrafts] = useState({});
  const [activeDraftId, setActiveDraftId] = useState(null);

  const getToken = () => localStorage.getItem("accessToken");

  const authHeaders = () => {
    const token = getToken();
    if (!token) return null;
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    const headers = authHeaders();
    if (!headers) {
      setError("No accessToken in localStorage. Login as employee first.");
      setLoading(false);
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/api/stalls`, { headers });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setStalls(Array.isArray(data) ? data : []);
      setDrafts({});
      setActiveDraftId(null);
    } catch (e) {
      setError(e.message || "Failed to load stalls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // bounds use stall positions OR draft positions (so stage grows if draft moves)
  const bounds = useMemo(() => {
    let maxX = 1;
    let maxY = 1;

    for (const s of stalls) {
      const dim = SIZE_TO_CELLS[s.size] || SIZE_TO_CELLS.SMALL;
      const d = drafts[s.id];
      const x = d?.x ?? s.xPosition ?? 1;
      const y = d?.y ?? s.yPosition ?? 1;

      const endX = x + dim.w;
      const endY = y + dim.h;

      maxX = Math.max(maxX, endX);
      maxY = Math.max(maxY, endY);
    }

    return { cols: maxX + 8, rows: maxY + 8 };
  }, [stalls, drafts]);

  const stagePx = useMemo(() => {
    const { CELL, GAP, PAD } = GRID;
    const w = PAD * 2 + bounds.cols * CELL + (bounds.cols - 1) * GAP;
    const h = PAD * 2 + bounds.rows * CELL + (bounds.rows - 1) * GAP;
    return { width: w, height: h };
  }, [bounds]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const available = el.clientWidth;
      const needed = stagePx.width;
      if (!available || !needed) return;
      const s = Math.min(1, Math.max(0.6, available / needed));
      setScale(s);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [stagePx.width]);

  // --- overlap helpers (consider drafts) ---
  const rectFor = (stallId) => {
    const s = stalls.find((x) => x.id === stallId);
    if (!s) return null;

    const dim = SIZE_TO_CELLS[s.size] || SIZE_TO_CELLS.SMALL;
    const d = drafts[stallId];

    const x = d?.x ?? s.xPosition;
    const y = d?.y ?? s.yPosition;

    return { x, y, w: dim.w, h: dim.h };
  };

  const overlaps = (a, b) => {
    return !(
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y
    );
  };

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
    const left = PAD + (x - 1) * (CELL + GAP);
    const top = PAD + (y - 1) * (CELL + GAP);
    return { left, top };
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

    const width = dim.w * CELL + (dim.w - 1) * GAP;
    const height = dim.h * CELL + (dim.h - 1) * GAP;

    const isDraft = !!drafts[s.id];

    return {
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 10,
      background: isDraft ? "rgba(59,130,246,0.16)" : "rgba(16,185,129,0.14)",
      border: isDraft
        ? "1px solid rgba(59,130,246,0.55)"
        : "1px solid rgba(16,185,129,0.55)",
      cursor: "grab",
      userSelect: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      fontSize: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      zIndex: isDraft ? 5 : 1,
    };
  };

  // ✅ Save a draft to backend (PUT)
  const confirmDraft = async (id) => {
    const d = drafts[id];
    if (!d) return;

    const headers = authHeaders();
    if (!headers) {
      setError("No accessToken in localStorage. Login as employee first.");
      return;
    }

    const s = stalls.find((x) => x.id === id);
    if (!s) return;

    // overlap check again before saving
    const nextRect = { ...rectFor(id) };
    if (!canPlace(id, nextRect)) {
      setError("Overlap detected. Cannot confirm.");
      return;
    }

    // mark saving
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], saving: true },
    }));

    try {
      const r = await fetch(`${API_BASE}/api/stalls/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          stallCode: s.stallCode,
          size: s.size,
          xPosition: d.x,
          yPosition: d.y,
        }),
      });
      if (!r.ok) throw new Error(`Update failed (HTTP ${r.status})`);

      // ✅ update local stall position & clear draft
      setStalls((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, xPosition: d.x, yPosition: d.y } : x,
        ),
      );
      setDrafts((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeDraftId === id) setActiveDraftId(null);
      setMsg(`Saved ${s.stallCode} at (${d.x},${d.y})`);
      setError("");
    } catch (e) {
      setError(e.message || "Update failed");
      setMsg("");
      // remove saving flag
      setDrafts((prev) => ({
        ...prev,
        [id]: { ...prev[id], saving: false },
      }));
    }
  };

  const cancelDraft = (id) => {
    const d = drafts[id];
    if (!d) return;

    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeDraftId === id) setActiveDraftId(null);

    setMsg("");
    setError("");
  };

  // --- drag handlers ---
  const onMouseDown = async (e, s) => {
    setMsg("");
    setError("");

    // ✅ If there is a different active draft, auto-confirm it first
    if (activeDraftId && activeDraftId !== s.id) {
      await confirmDraft(activeDraftId);
    }

    // ensure a draft exists for this stall (store original pos once)
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

  const onMouseMove = (e) => {
    if (!drag) return;

    const { CELL, GAP } = GRID;
    const step = CELL + GAP;

    const dx = e.clientX - drag.startMouseX;
    const dy = e.clientY - drag.startMouseY;

    const moveX = Math.round(dx / step);
    const moveY = Math.round(dy / step);

    const newX = Math.max(1, drag.startX + moveX);
    const newY = Math.max(1, drag.startY + moveY);

    const dim = SIZE_TO_CELLS[stalls.find((x) => x.id === drag.id)?.size] || {
      w: 2,
      h: 2,
    };

    const nextRect = { x: newX, y: newY, w: dim.w, h: dim.h };

    // ✅ prevent overlap while dragging (just don’t move into invalid)
    if (!canPlace(drag.id, nextRect)) return;

    setDrafts((prev) => ({
      ...prev,
      [drag.id]: {
        ...(prev[drag.id] || {}),
        x: newX,
        y: newY,
        saving: prev[drag.id]?.saving ?? false,
        originalX: prev[drag.id]?.originalX ?? drag.startX,
        originalY: prev[drag.id]?.originalY ?? drag.startY,
      },
    }));
  };

  const onMouseUp = () => {
    if (!drag) return;
    setDrag(null);
    // ✅ do NOT call backend here anymore
    // confirm/cancel will do it
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  const addStall = async () => {
    setMsg("");
    setError("");

    const code = newCode.trim();
    if (!code) return setError("Enter stall code.");

    const headers = authHeaders();
    if (!headers)
      return setError(
        "No accessToken in localStorage. Login as employee first.",
      );

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

    if (!found)
      return setError(
        "No space available. Rearrange stalls or increase map area.",
      );

    try {
      const r = await fetch(`${API_BASE}/api/stalls`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          stallCode: code,
          size: newSize,
          xPosition: found.x,
          yPosition: found.y,
        }),
      });
      if (!r.ok) throw new Error(`Create failed (HTTP ${r.status})`);
      const created = await r.json().catch(() => null);

      // ✅ update locally (no need to refetch)
      if (created?.id) {
        setStalls((prev) => [...prev, created]);
      } else {
        // fallback if backend doesn't return created entity
        await fetchAll();
      }

      setMsg(`Added ${code} (${newSize})`);
      setNewCode("");
    } catch (e) {
      setError(e.message || "Create failed");
    }
  };

  const deleteStall = async (id) => {
    setMsg("");
    setError("");

    const headers = authHeaders();
    if (!headers)
      return setError(
        "No accessToken in localStorage. Login as employee first.",
      );

    try {
      const r = await fetch(`${API_BASE}/api/stalls/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!r.ok) throw new Error(`Delete failed (HTTP ${r.status})`);

      setStalls((prev) => prev.filter((s) => s.id !== id));
      setDrafts((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeDraftId === id) setActiveDraftId(null);

      setMsg("Deleted stall.");
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ margin: 0 }}>Employee Stall Layout Editor</h2>
      <div style={{ marginTop: 6, color: "#64748b" }}>
        Drag stalls to move. Click <b>Confirm</b> to save.
      </div>

      {(msg || error) && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.3)",
            background: msg ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
            color: msg ? "#065f46" : "#991b1b",
          }}
        >
          {msg || error}
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          padding: 12,
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.25)",
          background: "#fff",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>Stall Code</span>
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="ex: S12"
            style={{
              height: 36,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,0.35)",
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>Size</span>
          <select
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            style={{
              height: 36,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,0.35)",
              outline: "none",
              background: "#fff",
            }}
          >
            <option value="SMALL">SMALL</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LARGE">LARGE</option>
          </select>
        </label>

        <button
          onClick={addStall}
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid rgba(16,185,129,0.55)",
            background: "rgba(16,185,129,0.14)",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Stall
        </button>

        <button
          onClick={fetchAll}
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.35)",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Refresh
        </button>

        <div style={{ marginLeft: "auto", color: "#64748b", fontSize: 13 }}>
          {loading ? "Loading..." : `${stalls.length} stalls`}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.25)",
          background: "#fff",
          overflow: "auto",
          padding: 10,
        }}
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
            style={{
              position: "relative",
              width: stagePx.width,
              height: stagePx.height,
              borderRadius: 12,
              backgroundImage: `
                linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID.CELL + GRID.GAP}px ${GRID.CELL + GRID.GAP}px`,
              backgroundPosition: `${GRID.PAD}px ${GRID.PAD}px`,
            }}
          >
            {stalls.map((s) => {
              const d = drafts[s.id];
              const isDraft = !!d;

              return (
                <div
                  key={s.id}
                  style={stallStyle(s)}
                  onMouseDown={(e) => onMouseDown(e, s)}
                  title="Drag to move"
                >
                  <div style={{ fontWeight: 800 }}>{s.stallCode}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{s.size}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    ({d?.x ?? s.xPosition}, {d?.y ?? s.yPosition})
                  </div>

                  {/* ✅ Confirm/Cancel only if draft exists */}
                  {isDraft && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDraft(s.id);
                        }}
                        disabled={d?.saving}
                        style={{
                          fontSize: 11,
                          padding: "4px 8px",
                          borderRadius: 8,
                          border: "1px solid rgba(59,130,246,0.45)",
                          background: "rgba(59,130,246,0.12)",
                          cursor: d?.saving ? "not-allowed" : "pointer",
                          opacity: d?.saving ? 0.6 : 1,
                        }}
                        title="Confirm position"
                      >
                        {d?.saving ? "Saving..." : "Confirm"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelDraft(s.id);
                        }}
                        disabled={d?.saving}
                        style={{
                          fontSize: 11,
                          padding: "4px 8px",
                          borderRadius: 8,
                          border: "1px solid rgba(148,163,184,0.45)",
                          background: "rgba(148,163,184,0.12)",
                          cursor: d?.saving ? "not-allowed" : "pointer",
                          opacity: d?.saving ? 0.6 : 1,
                        }}
                        title="Cancel changes"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStall(s.id);
                    }}
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid rgba(239,68,68,0.35)",
                      background: "rgba(239,68,68,0.10)",
                      cursor: "pointer",
                    }}
                    title="Delete stall"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
        Tip: Draft changes are saved only when you press Confirm. If you start
        moving another stall, the previous draft is auto-confirmed.
      </div>
    </div>
  );
}
