import React, { useState, useEffect } from "react";
import { XIcon } from "./Icons.jsx";

const TOGGLES = [
  { key: "petFriendly", label: "Pet friendly" },
  { key: "coupleFriendly", label: "Good for couples" },
  { key: "familyFriendly", label: "Good for families" },
  { key: "rooftopSeating", label: "Rooftop seating" },
  { key: "outdoorSeating", label: "Outdoor seating" },
  { key: "veganOptions", label: "Vegan options" },
];

export default function FilterSheet({ open, onClose, filters, options, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  if (!open) return null;

  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const reset = () => {
    const cleared = {
      area: "",
      theme: "",
      cuisine: "",
      bestFor: "",
      minRating: "",
      petFriendly: false,
      coupleFriendly: false,
      familyFriendly: false,
      rooftopSeating: false,
      outdoorSeating: false,
      veganOptions: false,
    };
    setDraft(cleared);
  };

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="presentation"
    >
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ fontSize: "1.1rem" }}>Filter cafés</h3>
          <button
            type="button"
            className="round-icon-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            <XIcon />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "4px 20px 20px" }}>
          <div className="form-field">
            <label htmlFor="f-area">Neighbourhood</label>
            <select
              id="f-area"
              value={draft.area}
              onChange={(e) => update("area", e.target.value)}
            >
              <option value="">Any neighbourhood</option>
              {options.areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="f-theme">Theme</label>
            <select
              id="f-theme"
              value={draft.theme}
              onChange={(e) => update("theme", e.target.value)}
            >
              <option value="">Any theme</option>
              {options.themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="f-cuisine">Cuisine</label>
            <select
              id="f-cuisine"
              value={draft.cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
            >
              <option value="">Any cuisine</option>
              {options.cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="f-bestfor">Best for</label>
            <select
              id="f-bestfor"
              value={draft.bestFor}
              onChange={(e) => update("bestFor", e.target.value)}
            >
              <option value="">Any occasion</option>
              {options.bestFor.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="f-rating">Minimum rating</label>
            <select
              id="f-rating"
              value={draft.minRating}
              onChange={(e) => update("minRating", e.target.value)}
            >
              <option value="">Any rating</option>
              <option value="4">4.0+</option>
              <option value="4.3">4.3+</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
            </select>
          </div>

          <div className="form-field">
            <label>Amenities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOGGLES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`chip ${draft[t.key] ? "active" : ""}`}
                  onClick={() => update(t.key, !draft[t.key])}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={footerStyle}>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => onApply(draft)}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(42, 27, 14, 0.45)",
  zIndex: 50,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
};

const sheetStyle = {
  background: "var(--haveli-plaster)",
  width: "100%",
  maxWidth: 480,
  maxHeight: "85vh",
  borderRadius: "22px 22px 0 0",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 20px 8px",
  position: "sticky",
  top: 0,
};

const footerStyle = {
  padding: "14px 20px 22px",
  display: "flex",
  gap: 10,
  borderTop: "1px solid var(--jali-line)",
};
