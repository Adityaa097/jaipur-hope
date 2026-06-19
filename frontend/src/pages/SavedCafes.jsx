import React from "react";
import { Link } from "react-router-dom";
import { useSavedCafes } from "../hooks.js";
import { EmptyState } from "../components/Shared.jsx";
import { StarIcon, MapPinIcon } from "../components/Icons.jsx";

export default function SavedCafes() {
  const { saved } = useSavedCafes();

  return (
    <div className="bookings-page">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 6 }}>Saved cafés</h1>
      <p style={{ color: "var(--ink-henna-soft)", fontSize: "0.88rem", marginBottom: 18 }}>
        Cafés you've hearted, kept on this device.
      </p>

      {saved.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the heart on any café to keep it here for later."
        />
      ) : (
        saved.map((cafe) => (
          <Link to={`/cafe/${cafe.id}`} className="booking-list-card" key={cafe.id}>
            {cafe.coverImage ? <img src={cafe.coverImage} alt={cafe.name} /> : null}
            <div className="info">
              <h4>{cafe.name}</h4>
              <p>
                <MapPinIcon style={{ width: 12, height: 12, display: "inline" }} /> {cafe.area}
              </p>
              {cafe.rating ? (
                <p>
                  <StarIcon style={{ width: 12, height: 12, display: "inline", color: "var(--marigold)" }} />{" "}
                  {cafe.rating.toFixed(1)} · {cafe.theme}
                </p>
              ) : (
                <p>{cafe.theme}</p>
              )}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
