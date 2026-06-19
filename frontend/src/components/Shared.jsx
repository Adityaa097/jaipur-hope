import React from "react";
import { JaliLoader } from "./JaliMotif.jsx";

export function Loader({ label = "Loading cafés..." }) {
  return (
    <div className="loader-wrap">
      <JaliLoader />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
      {actionLabel ? (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
