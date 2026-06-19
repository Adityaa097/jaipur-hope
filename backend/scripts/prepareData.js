/**
 * prepareData.js
 * Reads backend/data/raw_cafes.json (the raw scraped dataset) and writes
 * backend/data/cafes.json — a cleaned, normalized version the API serves.
 *
 * Run with:  node scripts/prepareData.js   (from inside /backend)
 * Re-run this any time raw_cafes.json is replaced with a fresh export.
 */

const fs = require("fs");
const path = require("path");

const RAW_PATH = path.join(__dirname, "..", "data", "raw_cafes.json");
const OUT_PATH = path.join(__dirname, "..", "data", "cafes.json");

function toBool(v) {
  if (typeof v !== "string") return false;
  return v.trim().toLowerCase() === "yes";
}

function cleanArea(raw) {
  if (!raw) return "Jaipur";
  // strip non-breaking spaces and regular whitespace
  let a = raw.replace(/\u00a0/g, " ").trim();
  // fix known inconsistent casings so filter chips don't duplicate
  const fixes = {
    "bani park": "Bani Park",
    "nirman nagar": "Nirman Nagar",
    "adarsh nagar": "Adarsh Nagar",
    "ashok nagar": "Ashok Nagar",
    "jaleb chowk": "Jaleb Chowk",
    "narayan singh circle": "Narayan Singh Circle",
    "jyothi nagar": "Jyoti Nagar",
    "ajmer road": "Ajmer Road",
    durgapura: "Durgapura",
  };
  const lower = a.toLowerCase();
  if (fixes[lower]) return fixes[lower];
  return a;
}

function splitList(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/,|&|\/| and /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseReviewCount(raw) {
  if (raw === null || raw === undefined) return 0;
  const cleaned = String(raw).replace(/,/g, "").trim();
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseRating(raw) {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
}

// Normalizes the messy opening_time formats found in the raw export
// ("11 AM", "23:00:00", "1900-01-01T10:00:00") into "h:mm AM/PM".
function normalizeTime(raw) {
  if (!raw) return null;
  const s = String(raw).trim();

  // already like "11 AM" / "8 AM"
  let m = s.match(/^(\d{1,2})\s*(AM|PM)$/i);
  if (m) {
    return `${parseInt(m[1], 10)}:00 ${m[2].toUpperCase()}`;
  }

  // "HH:MM:SS" (24h)
  m = s.match(/^(\d{1,2}):(\d{2}):\d{2}$/);
  if (!m) {
    // "1900-01-01THH:MM:SS"
    m = s.match(/T(\d{1,2}):(\d{2}):\d{2}$/);
  }
  if (m) {
    let hour = parseInt(m[1], 10);
    const min = m[2];
    const period = hour >= 12 ? "PM" : "AM";
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${min} ${period}`;
  }

  return s; // fall back to whatever was there
}

function slugify(name, area, index) {
  const base = `${name}-${area}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${index}`;
}

function buildImageArray(rec) {
  return [rec.cafe_image1, rec.cafe_image2, rec.cafe_image3, rec.cafes_image4]
    .map((u) => (typeof u === "string" ? u.trim() : ""))
    .filter(Boolean);
}

function clean() {
  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf-8"));

  const cafes = raw.map((rec, index) => {
    const name = (rec.cafe_name || "Unnamed Cafe").trim();
    const area = cleanArea(rec.area);
    const images = buildImageArray(rec);

    return {
      id: slugify(name, area, index),
      name,
      city: (rec.city || "Jaipur").trim(),
      area,
      address: rec.address ? rec.address.trim() : null,
      googleMapsLink: rec.google_maps_link || null,
      businessType: rec.business_type || null,
      cuisines: splitList(rec.cuisine_type),
      theme: rec.cafe_theme ? rec.cafe_theme.trim() : "Cafe",
      bestFor: splitList(rec.best_for),
      images,
      coverImage: images[0] || null,
      rating: parseRating(rec.google_rating),
      reviewCount: parseReviewCount(rec.review_count),
      aestheticScore: parseRating(rec.aesthetic_score),
      foodQualityRating: parseRating(rec.food_quality_rating),
      ambienceRating: parseRating(rec.ambience_rating),
      openingTime: normalizeTime(rec.opening_time),
      petFriendly: toBool(rec.pet_friendly),
      coupleFriendly: toBool(rec.couple_friendly),
      familyFriendly: toBool(rec.family_friendly),
      rooftopSeating: toBool(rec.rooftop_seating),
      outdoorSeating: toBool(rec.outdoor_seating),
      veganOptions: toBool(rec.vegan_options),
      vegetarianOnly: toBool(rec.vegetarian_only),
      keywords: splitList(rec.user_reviews_keywords),
    };
  });

  fs.writeFileSync(OUT_PATH, JSON.stringify(cafes, null, 2), "utf-8");

  console.log(`Prepared ${cafes.length} cafes -> ${OUT_PATH}`);
  const noImages = cafes.filter((c) => c.images.length === 0).length;
  console.log(`Cafes with no image: ${noImages}`);
}

clean();
