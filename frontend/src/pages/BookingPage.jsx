import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCafe, createBooking } from "../api.js";
import { Loader, EmptyState } from "../components/Shared.jsx";
import { ChevronLeftIcon } from "../components/Icons.jsx";
import { useLocalStorage } from "../hooks.js";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function to12Hour(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [savedName, setSavedName] = useLocalStorage("jaipur-hope:name", "");
  const [savedPhone, setSavedPhone] = useLocalStorage("jaipur-hope:phone", "");

  const [name, setName] = useState(savedName);
  const [phone, setPhone] = useState(savedPhone);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");

  useEffect(() => {
    getCafe(id)
      .then(setCafe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Setting the table..." />;
  if (!cafe) {
    return (
      <EmptyState
        title="We couldn't find that café"
        body={error || "Try going back and picking a café again."}
        actionLabel="Back to all cafés"
        onAction={() => navigate("/")}
      />
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone number so the café can reach you.");
      return;
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(phone.trim())) {
      setError("That phone number doesn't look right — please double check it.");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        cafeId: cafe.id,
        name: name.trim(),
        phone: phone.trim(),
        date,
        time: to12Hour(time),
        guests,
        specialRequest,
      });
      setSavedName(name.trim());
      setSavedPhone(phone.trim());
      navigate("/confirmation", { state: { booking } });
    } catch (err) {
      setError(err.message || "Something went wrong while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-page">
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0 18px" }}>
        <button
          type="button"
          className="round-icon-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </button>
        <h2 style={{ fontSize: "1.2rem" }}>Reserve a table</h2>
      </div>

      <div className="booking-summary-card">
        {cafe.coverImage ? <img src={cafe.coverImage} alt={cafe.name} /> : null}
        <div>
          <h3>{cafe.name}</h3>
          <p>
            {cafe.area}, Jaipur{cafe.openingTime ? ` · Opens ${cafe.openingTime}` : ""}
          </p>
        </div>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="b-name">Your name</label>
          <input
            id="b-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aanya Sharma"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="b-phone">Phone number</label>
          <input
            id="b-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 98290 12345"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="b-date">Date</label>
            <input
              id="b-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="b-time">Time</label>
            <input
              id="b-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label>Guests</label>
          <div className="stepper">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              aria-label="Decrease guests"
            >
              −
            </button>
            <span>{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(30, g + 1))}
              aria-label="Increase guests"
            >
              +
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="b-note">Special request (optional)</label>
          <textarea
            id="b-note"
            rows={3}
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Window seat, birthday cake, wheelchair access..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Reserving your table..." : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
