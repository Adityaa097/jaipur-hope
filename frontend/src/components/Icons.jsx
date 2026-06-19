import React from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const XIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const StarIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" {...p}>
    <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.3 5.9 20.5l1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" />
  </svg>
);

export const MapPinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.5s-7.6-4.6-10-9.1C.5 8.1 2 4.5 5.5 4c2-.3 3.8.7 6.5 3.3C14.7 4.7 16.5 3.7 18.5 4c3.5.5 5 4.1 3.5 7.4-2.4 4.5-10 9.1-10 9.1z" />
  </svg>
);

export const ChevronLeftIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const UsersIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
    <path d="M16.5 4.4a3.2 3.2 0 010 6.2" />
    <path d="M19 13.8c2.3.7 3.5 2.7 3.5 6.2" />
  </svg>
);

export const PawIcon = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="16.5" rx="5" ry="4" />
    <ellipse cx="5.2" cy="10.5" rx="2" ry="2.6" />
    <ellipse cx="9.2" cy="6" rx="2" ry="2.6" />
    <ellipse cx="14.8" cy="6" rx="2" ry="2.6" />
    <ellipse cx="18.8" cy="10.5" rx="2" ry="2.6" />
  </svg>
);

export const LeafIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 20c8.5 0 14-5.5 14-14V4h-2C8.5 4 5 9.5 5 18v2z" />
    <path d="M5 20c0-4 3-9 9-12.5" />
  </svg>
);

export const SunIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.6M12 18.9v2.6M3.5 12h2.6M17.9 12h2.6M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9" />
  </svg>
);

export const BuildingIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
  </svg>
);

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 11.5L12 4l8 7.5" />
    <path d="M6 9.5V20h12V9.5" />
  </svg>
);

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const BookmarkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3.5h12v17l-6-4-6 4v-17z" />
  </svg>
);

export const SlidersIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M21 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const ExternalLinkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h6" />
  </svg>
);

export const CheckCircleIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.3l2.4 2.4 4.6-5.4" />
  </svg>
);

export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 005.5 5.5l1.5-2 4 1.5V18a2 2 0 01-2.2 2A16 16 0 015 6.2 2 2 0 015 4z" />
  </svg>
);

export const UtensilsIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3v7a2 2 0 002 2v9M6 3v6M8 3v6M10 3v6" />
    <path d="M16 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v10" />
  </svg>
);
