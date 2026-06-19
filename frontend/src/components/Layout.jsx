import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BrandMark } from "./JaliMotif.jsx";
import { HomeIcon, BookmarkIcon, CalendarIcon, MapPinIcon } from "./Icons.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Discover", icon: HomeIcon, end: true },
  { to: "/saved", label: "Saved", icon: BookmarkIcon },
  { to: "/bookings", label: "Bookings", icon: CalendarIcon },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <nav className="side-nav">
        <div className="side-nav-brand">
          <BrandMark />
          <span className="brand-name">Jaipur Hope</span>
        </div>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `side-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="app-main">
        <Outlet />
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="shell-inner brand-row">
        <div className="brand">
          <BrandMark />
          <span className="brand-name">Jaipur Hope</span>
        </div>
        <span className="brand-city-chip">
          <MapPinIcon />
          Jaipur, Pink City
        </span>
      </div>
    </header>
  );
}
