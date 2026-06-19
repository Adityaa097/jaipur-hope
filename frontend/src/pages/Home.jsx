import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TopBar } from "../components/Layout.jsx";
import CafeCard from "../components/CafeCard.jsx";
import FilterSheet from "../components/FilterSheet.jsx";
import { Loader, EmptyState } from "../components/Shared.jsx";
import { JaliDivider } from "../components/JaliMotif.jsx";
import { SearchIcon, XIcon, SlidersIcon } from "../components/Icons.jsx";
import { getCafes, getFilters } from "../api.js";

const DEFAULT_FILTERS = {
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

const QUICK_TOGGLES = [
  { key: "rooftopSeating", label: "Rooftop" },
  { key: "petFriendly", label: "Pet friendly" },
  { key: "veganOptions", label: "Vegan" },
  { key: "familyFriendly", label: "Family" },
  { key: "coupleFriendly", label: "Date night" },
];

const POPULAR_AREAS = [
  "C-Scheme",
  "Malviya Nagar",
  "Vaishali Nagar",
  "MI Road",
  "Bani Park",
  "Raja Park",
  "Jagatpura",
  "Tonk Road",
  "Ajmer Road",
];

const PAGE_SIZE = 12;

function buildParams(search, filters, sortBy, page) {
  const params = { search, sortBy, page, limit: PAGE_SIZE };
  ["area", "theme", "cuisine", "bestFor", "minRating"].forEach((k) => {
    if (filters[k]) params[k] = filters[k];
  });
  [
    "petFriendly",
    "coupleFriendly",
    "familyFriendly",
    "rooftopSeating",
    "outdoorSeating",
    "veganOptions",
  ].forEach((k) => {
    if (filters[k]) params[k] = "true";
  });
  return params;
}

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    areas: [],
    themes: [],
    cuisines: [],
    bestFor: [],
  });

  const [cafes, setCafes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // debounce free-text search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    getFilters()
      .then(setFilterOptions)
      .catch(() => {});
  }, []);

  const fetchPage = useCallback(
    async (targetPage, append) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const params = buildParams(search, filters, sortBy, targetPage);
        const data = await getCafes(params);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setCafes((prev) => (append ? [...prev, ...data.cafes] : data.cafes));
      } catch (err) {
        setError(err.message || "Could not load cafés. Is the backend running?");
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [search, filters, sortBy]
  );

  // refetch from page 1 whenever search/filters/sort change
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters, sortBy]);

  const toggleQuick = (key) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const toggleArea = (area) => {
    setFilters((f) => ({ ...f, area: f.area === area ? "" : area }));
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    Object.entries(filters).forEach(([k, v]) => {
      if (v) n += 1;
    });
    return n;
  }, [filters]);

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
  };

  return (
    <>
      <TopBar />
      <div className="shell-inner">
        <section className="hero">
          <p className="hero-eyebrow">282 cafés &middot; one Pink City</p>
          <h1>
            Find your spot in <em>Jaipur</em>
          </h1>
          <p>
            From rooftop sundowners near Hawa Mahal to quiet coffee corners in
            C-Scheme — search, filter, and book a table in seconds.
          </p>

          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by café, area, or cuisine..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput ? (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <XIcon />
              </button>
            ) : null}
          </div>
        </section>

        <div className="chip-row">
          <button
            type="button"
            className="chip-icon-btn"
            onClick={() => setSheetOpen(true)}
          >
            <SlidersIcon />
            Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
          </button>
          {QUICK_TOGGLES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`chip ${filters[t.key] ? "active" : ""}`}
              onClick={() => toggleQuick(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--ink-henna-faint)",
            margin: "14px 0 6px",
          }}
        >
          Browse by neighbourhood
        </p>
        <div className="chip-row">
          {(filterOptions.areas.length ? filterOptions.areas : POPULAR_AREAS).map(
            (area) => (
              <button
                key={area}
                type="button"
                className={`chip ${filters.area === area ? "active" : ""}`}
                onClick={() => toggleArea(area)}
              >
                {area}
              </button>
            )
          )}
        </div>

        <JaliDivider className="jali-divider" />

        <div className="results-header">
          <span className="results-count">
            <strong>{total}</strong> café{total === 1 ? "" : "s"} found
          </span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort cafés"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="aesthetic">Most aesthetic</option>
            <option value="reviews">Most reviewed</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState
            title="Couldn't reach the kitchen"
            body={error}
            actionLabel="Try again"
            onAction={() => fetchPage(1, false)}
          />
        ) : cafes.length === 0 ? (
          <EmptyState
            title="No cafés match these filters yet"
            body="Try loosening a filter or searching a different neighbourhood."
            actionLabel="Reset filters"
            onAction={resetAll}
          />
        ) : (
          <>
            <div className="cafe-grid">
              {cafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>

            {page < totalPages ? (
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: 24 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={loadingMore}
                  onClick={() => fetchPage(page + 1, true)}
                >
                  {loadingMore ? "Loading..." : `Load more (${total - cafes.length} left)`}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        options={
          filterOptions.areas.length
            ? filterOptions
            : { areas: [], themes: [], cuisines: [], bestFor: [] }
        }
        onApply={(draft) => {
          setFilters(draft);
          setSheetOpen(false);
        }}
      />
    </>
  );
}
