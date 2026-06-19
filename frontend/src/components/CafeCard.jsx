import React from "react";
import { Link } from "react-router-dom";
import { StarIcon, MapPinIcon, HeartIcon } from "./Icons.jsx";
import { ArchRow } from "./JaliMotif.jsx";
import { useSavedCafes } from "../hooks.js";

export default function CafeCard({ cafe }) {
  const { isSaved, toggleSave } = useSavedCafes();
  const saved = isSaved(cafe.id);

  return (
    <Link to={`/cafe/${cafe.id}`} className="cafe-card">
      <div className="cafe-card-media">
        {cafe.coverImage ? (
          <img src={cafe.coverImage} alt={cafe.name} loading="lazy" />
        ) : null}
        <span className="cafe-card-theme-tag">{cafe.theme}</span>
        {cafe.rating ? (
          <span className="cafe-card-rating">
            <StarIcon />
            {cafe.rating.toFixed(1)}
          </span>
        ) : null}
        <button
          type="button"
          className={`save-btn ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove from saved cafés" : "Save this café"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(cafe);
          }}
        >
          <HeartIcon />
        </button>
        <ArchRow />
      </div>

      <div className="cafe-card-body">
        <div className="cafe-card-name">{cafe.name}</div>
        <div className="cafe-card-meta">
          <MapPinIcon />
          <span>{cafe.area}</span>
          {cafe.cuisines?.length ? (
            <>
              <span className="dot-sep">&middot;</span>
              <span>{cafe.cuisines[0]}</span>
            </>
          ) : null}
        </div>
        <div className="tag-row">
          {cafe.rooftopSeating ? <span className="tag gold">Rooftop</span> : null}
          {cafe.petFriendly ? <span className="tag green">Pet friendly</span> : null}
          {cafe.coupleFriendly ? <span className="tag">Date-worthy</span> : null}
          {cafe.veganOptions ? <span className="tag blue">Vegan options</span> : null}
        </div>
      </div>
    </Link>
  );
}
