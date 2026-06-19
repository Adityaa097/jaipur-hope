import React from "react";

/* A thin repeating diamond-lattice strip, echoing Jaipur's carved
   sandstone jali screens. Used as a section divider. */
export function JaliDivider({ className = "" }) {
  return (
    <svg
      className={`jali-divider ${className}`}
      viewBox="0 0 200 16"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="jaliPattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M8 1L15 8L8 15L1 8Z"
            fill="none"
            stroke="var(--jali-line)"
            strokeWidth="1.2"
          />
          <circle cx="8" cy="8" r="1.4" fill="var(--rose-sandstone)" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="16" fill="url(#jaliPattern)" />
    </svg>
  );
}

/* A row of small jharokha-style scalloped arches — echoes the
   balconies of Hawa Mahal. Sits at the bottom edge of card images,
   the one signature flourish the rest of the UI stays quiet around. */
export function ArchRow({ color = "var(--surface)", className = "" }) {
  return (
    <svg
      className={`arch-row ${className}`}
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,14 L0,8 Q5,0 10,8 Q15,0 20,8 Q25,0 30,8 Q35,0 40,8 Q45,0 50,8 Q55,0 60,8 Q65,0 70,8 Q75,0 80,8 Q85,0 90,8 Q95,0 100,8 Q105,0 110,8 Q115,0 120,8 L120,14 Z"
        fill={color}
      />
    </svg>
  );
}

/* App logomark: "JH" set inside a jharokha arch outline. */
export function BrandMark({ className = "brand-mark" }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M4 36V18C4 9 11 3 20 3C29 3 36 9 36 18V36Z"
        fill="var(--rose-sandstone)"
      />
      <path
        d="M9 36V19C9 12.5 13.5 8 20 8C26.5 8 31 12.5 31 19V36"
        fill="none"
        stroke="var(--haveli-plaster)"
        strokeWidth="1.4"
        opacity="0.5"
      />
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontSize="13"
        fill="var(--haveli-plaster)"
      >
        JH
      </text>
    </svg>
  );
}

/* Pulsing jali-dot loader used while data is fetched. */
export function JaliLoader() {
  return (
    <svg className="jali-loader" viewBox="0 0 52 52" aria-hidden="true">
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => {
          // skip center to suggest a lattice rather than a solid grid
          if (row === 1 && col === 1) return null;
          return (
            <rect
              key={`${row}-${col}`}
              x={4 + col * 16}
              y={4 + row * 16}
              width="10"
              height="10"
              rx="2"
              fill="var(--rose-sandstone)"
            />
          );
        })
      )}
    </svg>
  );
}
