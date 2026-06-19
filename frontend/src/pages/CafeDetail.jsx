import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCafe } from "../api.js";
import { Loader, EmptyState } from "../components/Shared.jsx";
import { useSavedCafes } from "../hooks.js";
import {
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  PawIcon,
  LeafIcon,
  SunIcon,
  BuildingIcon,
  ExternalLinkIcon,
  UtensilsIcon,
} from "../components/Icons.jsx";

const AMENITY_DEFS = [
  { key: "petFriendly", label: "Pet friendly", icon: PawIcon },
  { key: "coupleFriendly", label: "Good for couples", icon: HeartIcon },
  { key: "familyFriendly", label: "Good for families", icon: UsersIcon },
  { key: "rooftopSeating", label: "Rooftop seating", icon: BuildingIcon },
  { key: "outdoorSeating", label: "Outdoor seating", icon: SunIcon },
  { key: "veganOptions", label: "Vegan options", icon: LeafIcon },
];

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedCafes();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCafe(id)
      .then(setCafe)
      .catch((err) => setError(err.message || "Café not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImg(idx);
  };

  if (loading) return <Loader label="Setting the table..." />;

  if (error || !cafe) {
    return (
      <EmptyState
        title="We couldn't find that café"
        body={error || "It may have been removed from the listing."}
        actionLabel="Back to all cafés"
        onAction={() => navigate("/")}
      />
    );
  }

  const saved = isSaved(cafe.id);

  return (
    <div className="detail-page">
      <div className="detail-back">
        <button
          type="button"
          className="round-icon-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          className="round-icon-btn"
          onClick={() => toggleSave(cafe)}
          aria-label={saved ? "Remove from saved" : "Save this café"}
        >
          <HeartIcon
            style={saved ? { fill: "var(--rose-sandstone)", color: "var(--rose-sandstone)" } : undefined}
          />
        </button>
      </div>

      <div className="gallery" ref={galleryRef} onScroll={onGalleryScroll}>
        {cafe.images.map((src, i) => (
          <img key={i} src={src} alt={`${cafe.name} photo ${i + 1}`} />
        ))}
      </div>
      {cafe.images.length > 1 ? (
        <div className="gallery-dots">
          {cafe.images.map((_, i) => (
            <span key={i} className={i === activeImg ? "active" : ""} />
          ))}
        </div>
      ) : null}

      <div className="detail-header">
        <p className="detail-theme-eyebrow">{cafe.theme}</p>
        <h1>{cafe.name}</h1>
        <div className="detail-stat-row">
          {cafe.rating ? (
            <span className="stat-pill rating">
              <StarIcon />
              <strong>{cafe.rating.toFixed(1)}</strong> ({cafe.reviewCount} reviews)
            </span>
          ) : null}
          {cafe.openingTime ? (
            <span className="stat-pill">
              <ClockIcon />
              Opens {cafe.openingTime}
            </span>
          ) : null}
          {cafe.businessType ? (
            <span className="stat-pill">
              <UtensilsIcon />
              {cafe.businessType}
            </span>
          ) : null}
        </div>
        <div className="tag-row">
          {cafe.cuisines.map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
          {cafe.bestFor.map((b) => (
            <span key={b} className="tag blue">
              {b}
            </span>
          ))}
        </div>
      </div>

      <section className="detail-section">
        <h2>Amenities</h2>
        <div className="amenity-grid">
          {AMENITY_DEFS.filter((a) => cafe[a.key]).map((a) => (
            <div className="amenity-item" key={a.key}>
              <a.icon />
              {a.label}
            </div>
          ))}
          {AMENITY_DEFS.every((a) => !cafe[a.key]) ? (
            <p style={{ color: "var(--ink-henna-soft)", fontSize: "0.86rem" }}>
              No extra amenities listed for this café.
            </p>
          ) : null}
        </div>
      </section>

      <section className="detail-section">
        <h2>Ratings breakdown</h2>
        <div className="score-bars">
          <ScoreBar label="Food quality" value={cafe.foodQualityRating} />
          <ScoreBar label="Ambience" value={cafe.ambienceRating} />
          <ScoreBar label="Aesthetic" value={cafe.aestheticScore} />
        </div>
      </section>

      {cafe.keywords.length ? (
        <section className="detail-section">
          <h2>What visitors say</h2>
          <div className="keyword-cloud">
            {cafe.keywords.map((k) => (
              <span key={k} className="tag green">
                {k}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="detail-section">
        <h2>Location</h2>
        <div className="detail-map-link">
          <p>
            <strong>{cafe.area}, Jaipur</strong>
            {cafe.address || "Exact address on the map"}
          </p>
          {cafe.googleMapsLink ? (
            <a
              href={cafe.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="round-icon-btn"
              aria-label="Open in Google Maps"
            >
              <ExternalLinkIcon />
            </a>
          ) : (
            <MapPinIcon />
          )}
        </div>
      </section>

      <div style={{ height: 24 }} />

      <div className="sticky-book-bar">
        <div className="price-note">
          <strong>{cafe.area}</strong>
          {cafe.openingTime ? `Opens ${cafe.openingTime}` : "Reserve ahead"}
        </div>
        <Link to={`/cafe/${cafe.id}/book`} className="btn btn-primary">
          Book a table
        </Link>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const v = value || 0;
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${Math.min((v / 5) * 100, 100)}%` }}
        />
      </div>
      <span className="score-bar-value">{v ? v.toFixed(1) : "—"}</span>
    </div>
  );
}
