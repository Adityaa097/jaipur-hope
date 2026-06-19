import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircleIcon } from "../components/Icons.jsx";

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="confirm-page">
        <h2>No booking to show</h2>
        <p style={{ color: "var(--ink-henna-soft)", margin: "10px 0 22px" }}>
          Looks like you landed here directly. Find a café to reserve a table.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
          Browse cafés
        </button>
      </div>
    );
  }

  return (
    <div className="confirm-page">
      <CheckCircleIcon className="confirm-icon" style={{ color: "var(--mehendi-green)" }} />
      <h1 style={{ fontSize: "1.5rem" }}>Table's yours.</h1>
      <p style={{ color: "var(--ink-henna-soft)", marginTop: 8 }}>
        {booking.cafeName} is expecting {booking.name}.
      </p>
      <div className="confirm-id">{booking.id}</div>

      <div className="confirm-details">
        <div className="confirm-row">
          <span>Café</span>
          <span>{booking.cafeName}</span>
        </div>
        <div className="confirm-row">
          <span>Area</span>
          <span>{booking.cafeArea}</span>
        </div>
        <div className="confirm-row">
          <span>Date</span>
          <span>{booking.date}</span>
        </div>
        <div className="confirm-row">
          <span>Time</span>
          <span>{booking.time}</span>
        </div>
        <div className="confirm-row">
          <span>Guests</span>
          <span>{booking.guests}</span>
        </div>
        <div className="confirm-row">
          <span>Phone</span>
          <span>{booking.phone}</span>
        </div>
        {booking.specialRequest ? (
          <div className="confirm-row">
            <span>Note</span>
            <span>{booking.specialRequest}</span>
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link to="/bookings" className="btn btn-primary btn-block">
          View my bookings
        </Link>
        <Link to="/" className="btn btn-ghost btn-block">
          Keep exploring
        </Link>
      </div>
    </div>
  );
}
