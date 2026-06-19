# Jaipur Hope — café booking app

A Zomato/District-style café discovery and table-booking app for Jaipur,
built from your `jaipur_cafes_actual_image_dataset.json` file. All **282**
cafés from the dataset are loaded in, each with its own photos.

```
jaipur-hope/
├── backend/     Node.js API (zero npm dependencies — just runs)
└── frontend/    React + Vite app (the actual interface you'll see)
```

---

## 1. Install Node.js (one-time setup)

You need Node.js 18 or newer. Open **Terminal** (Cmd+Space, type "Terminal")
and check if you already have it:

```bash
node --version
```

If that prints `v18` or higher, skip to step 2. Otherwise, install it one of
two ways:

**Option A — official installer (simplest):**
Go to [nodejs.org](https://nodejs.org), download the macOS LTS installer, and
run it like any other `.pkg` file.

**Option B — Homebrew (if you already use it):**
```bash
brew install node
```

Confirm it worked:
```bash
node --version
npm --version
```

---

## 2. Unzip the project

Unzip `jaipur-hope.zip` (double-click it in Finder, or `unzip jaipur-hope.zip`
in Terminal). You'll get a `jaipur-hope` folder — move it somewhere sensible
like `~/Projects/`, then `cd` into it:

```bash
cd ~/Projects/jaipur-hope
```

---

## 3. Start the backend (Terminal tab 1)

The backend is plain Node.js with **no dependencies to install** — it just
runs.

```bash
cd backend
node server.js
```

You should see:
```
Jaipur Hope API running on http://localhost:3001
Loaded 282 cafes
```

Leave this terminal tab open and running. This is your API server.

> If you ever replace `backend/data/raw_cafes.json` with a fresher export,
> regenerate the cleaned data with `node scripts/prepareData.js` before
> restarting the server.

---

## 4. Start the frontend (Terminal tab 2)

Open a **new** Terminal tab (Cmd+T), then:

```bash
cd ~/Projects/jaipur-hope/frontend
npm install
npm run dev
```

`npm install` will download React, Vite, and React Router (takes ~30–60
seconds). Once it finishes you'll see something like:

```
VITE v5.x.x  ready in 400 ms
➜  Local:   http://localhost:5173/
```

---

## 5. Open the app

Visit **http://localhost:5173** in your browser. You should see the Jaipur
Hope home screen — search bar, neighbourhood chips, and a grid of all 282
cafés with their real photos.

Try it end to end:
1. Search or filter for a café (try the "Rooftop" or "Pet friendly" chips).
2. Tap a café card to see its detail page — photo gallery, ratings breakdown,
   amenities, and a "Book a table" button.
3. Fill out the booking form and confirm — you'll land on a confirmation
   screen with a booking ID.
4. Go to **Bookings** in the nav and look up that booking by the phone number
   you used.
5. Heart a café from any card and check the **Saved** tab.

Both terminal tabs need to stay running while you use the app. To stop
either one, click into that tab and press `Ctrl+C`.

---

## How it's built

**Backend** (`backend/`) — a small Node.js HTTP server with no external
packages, so there's nothing that can fail to install. It serves:
- `GET /api/cafes` — list with search, filters, sorting, pagination
- `GET /api/cafes/:id` — single café
- `GET /api/filters` — distinct areas/themes/cuisines for the filter UI
- `POST /api/bookings`, `GET /api/bookings?phone=...`, `DELETE /api/bookings/:id`

Café data lives in `backend/data/cafes.json`, generated from your raw dataset
by `backend/scripts/prepareData.js` (already run once for you — all 282
records, with image URLs, ratings, amenities, and opening times all cleaned
up). Bookings are stored in `backend/data/bookings.json`, a simple file that
updates as people book — fine for local use or a demo; swap in a real
database (Postgres, MongoDB) before putting this in production.

**Frontend** (`frontend/`) — React + Vite, hand-styled (no UI framework) with
a design system themed around Jaipur itself: a sandstone-pink and blue-pottery
palette, and a recurring jali (lattice) lattice motif used as section dividers
and the scalloped "jharokha" edge under every café photo. Mobile-first with a
bottom nav; widens into a sidebar layout on desktop.

---

## Troubleshooting

**"Port 3001 already in use"** — something else is using that port. Either
quit it, or run the backend on a different port:
```bash
PORT=4000 node server.js
```
...and update `frontend/.env` to `VITE_API_URL=http://localhost:4000`.

**Frontend loads but no cafés appear / "Couldn't reach the kitchen"** — the
backend isn't running. Make sure Terminal tab 1 still shows
`Jaipur Hope API running...` with no errors.

**`npm install` fails or hangs** — check your internet connection; it needs
to download packages from the npm registry the first time only.

**Images look slow to load** — they're hosted on Google's CDN
(`googleusercontent.com`) straight from the original dataset, so load speed
depends on your internet connection, not the app.

**`node: command not found`** — Node.js isn't installed or isn't on your
PATH. Re-run the installer from [nodejs.org](https://nodejs.org), then open a
fresh Terminal tab.
