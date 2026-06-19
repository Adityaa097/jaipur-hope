import React, { useState, useEffect, useCallback } from "react";
import { getBookingsByPhone, cancelBooking } from "../api.js";
import { Loader, EmptyState } from "../components/Shared.jsx";
import { useLocalStorage } from "../hooks.js";

export default function MyBookings() {
  const [savedPhone, setSavedPhone] = useLocalStorage("jaipur-hope:phone", "");
  const [phoneInput, setPhoneInput] = useState(savedPhone);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const lookup = useCallback(async (phone) => {
    if (!phone.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await getBookingsByPhone(phone.trim());
      setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message || "Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (savedPhone) lookup(savedPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSavedPhone(phoneInput.trim());
    lookup(phoneInput);
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      setError(err.message || "Could not cancel that booking.");
    }
  };

  return (
    <div className="bookings-page">
      <h1 style={{ fontSize: "1.4rem", marginBottom: 6 }}>My bookings</h1>
      <p style={{ color: "var(--ink-henna-soft)", fontSize: "0.88rem", marginBottom: 18 }}>
        Look up reservations with the phone number you booked with.
      </p>

      <form className="phone-lookup" onSubmit={handleSearch}>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>

      {loading ? (
        <Loader label="Looking up your table..." />
      ) : error ? (
        <EmptyState title="Something went wrong" body={error} />
      ) : !searched ? (
        <EmptyState
          title="No bookings looked up yet"
          body="Enter the phone number you used when booking to see your reservations here."
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          body="We couldn't find any reservations under that number."
        />
      ) : (
        bookings.map((b) => (
          <div className="booking-list-card" key={b.id}>
            {b.cafeImage ? <img src={b.cafeImage} alt={b.cafeName} /> : null}
            <div className="info">
              <h4>{b.cafeName}</h4>
              <p>{b.cafeArea}, Jaipur</p>
              <p>
                {b.date} · {b.time} · {b.guests} guest{b.guests === 1 ? "" : "s"}
              </p>
              <span className={`status-badge ${b.status}`}>{b.status}</span>
              {b.status === "confirmed" ? (
                <div>
                  <button
                    type="button"
                    className="cancel-link"
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel booking
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
