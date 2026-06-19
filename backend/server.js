/**
 * Jaipur Hope — backend API server
 * Pure Node.js (no external dependencies) so `node server.js` just works
 * the moment Node is installed — nothing to npm install on this side.
 *
 * Endpoints:
 *   GET    /api/health
 *   GET    /api/cafes              list + filter + search + sort + paginate
 *   GET    /api/cafes/:id          single cafe
 *   GET    /api/filters            distinct areas / cuisines / themes / bestFor (for filter chips)
 *   GET    /api/bookings?phone=    a phone number's bookings ("My Bookings")
 *   POST   /api/bookings           create a booking
 *   DELETE /api/bookings/:id       cancel a booking
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const PORT = process.env.PORT || 3001;
const CAFES_PATH = path.join(__dirname, "data", "cafes.json");
const BOOKINGS_PATH = path.join(__dirname, "data", "bookings.json");

// ---------- data load / persistence ----------

let cafes = [];
try {
  cafes = JSON.parse(fs.readFileSync(CAFES_PATH, "utf-8"));
} catch (err) {
  console.error(
    "Could not read data/cafes.json. Run `node scripts/prepareData.js` first.",
    err.message
  );
  process.exit(1);
}

const cafesById = new Map(cafes.map((c) => [c.id, c]));

function readBookings() {
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), "utf-8");
}

if (!fs.existsSync(BOOKINGS_PATH)) writeBookings([]);

// ---------- small helpers ----------

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function notFound(res, message = "Not found") {
  send(res, 404, { error: message });
}

function badRequest(res, message) {
  send(res, 400, { error: message });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function matchesQuery(cafe, q) {
  if (q.search) {
    const s = q.search.toLowerCase();
    const haystack = `${cafe.name} ${cafe.area} ${cafe.cuisines.join(
      " "
    )} ${cafe.theme} ${cafe.keywords.join(" ")}`.toLowerCase();
    if (!haystack.includes(s)) return false;
  }
  if (q.area && cafe.area.toLowerCase() !== q.area.toLowerCase()) return false;
  if (
    q.theme &&
    cafe.theme.toLowerCase() !== q.theme.toLowerCase()
  )
    return false;
  if (
    q.cuisine &&
    !cafe.cuisines.some((c) => c.toLowerCase() === q.cuisine.toLowerCase())
  )
    return false;
  if (
    q.bestFor &&
    !cafe.bestFor.some((b) => b.toLowerCase() === q.bestFor.toLowerCase())
  )
    return false;
  if (q.petFriendly === "true" && !cafe.petFriendly) return false;
  if (q.coupleFriendly === "true" && !cafe.coupleFriendly) return false;
  if (q.familyFriendly === "true" && !cafe.familyFriendly) return false;
  if (q.rooftopSeating === "true" && !cafe.rooftopSeating) return false;
  if (q.outdoorSeating === "true" && !cafe.outdoorSeating) return false;
  if (q.veganOptions === "true" && !cafe.veganOptions) return false;
  if (q.minRating && cafe.rating !== null && cafe.rating < parseFloat(q.minRating))
    return false;
  return true;
}

function sortCafes(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "rating":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "aesthetic":
      sorted.sort((a, b) => (b.aestheticScore || 0) - (a.aestheticScore || 0));
      break;
    case "reviews":
      sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // "featured" — blend of rating and aesthetic score, stable default
      sorted.sort(
        (a, b) =>
          (b.rating || 0) + (b.aestheticScore || 0) -
          ((a.rating || 0) + (a.aestheticScore || 0))
      );
  }
  return sorted;
}

// ---------- route handlers ----------

function handleListCafes(req, res, query) {
  let result = cafes.filter((c) => matchesQuery(c, query));
  result = sortCafes(result, query.sortBy);

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const total = result.length;
  const start = (page - 1) * limit;
  const pageItems = result.slice(start, start + limit);

  send(res, 200, {
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    cafes: pageItems,
  });
}

function handleGetCafe(req, res, id) {
  const cafe = cafesById.get(id);
  if (!cafe) return notFound(res, "Cafe not found");
  send(res, 200, cafe);
}

function handleFilters(req, res) {
  const uniq = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b));
  send(res, 200, {
    areas: uniq(cafes.map((c) => c.area)),
    themes: uniq(cafes.map((c) => c.theme)),
    cuisines: uniq(cafes.flatMap((c) => c.cuisines)),
    bestFor: uniq(cafes.flatMap((c) => c.bestFor)),
    total: cafes.length,
  });
}

function handleGetBookings(req, res, query) {
  const bookings = readBookings();
  if (!query.phone) return send(res, 200, bookings);
  const phone = query.phone.replace(/\s+/g, "");
  const mine = bookings.filter(
    (b) => b.phone.replace(/\s+/g, "") === phone
  );
  send(res, 200, mine);
}

async function handleCreateBooking(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return badRequest(res, err.message);
  }

  const { cafeId, name, phone, date, time, guests, specialRequest } = body;

  if (!cafeId || !name || !phone || !date || !time || !guests) {
    return badRequest(
      res,
      "cafeId, name, phone, date, time and guests are all required"
    );
  }

  const cafe = cafesById.get(cafeId);
  if (!cafe) return badRequest(res, "Unknown cafeId");

  const guestCount = parseInt(guests, 10);
  if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 30) {
    return badRequest(res, "guests must be a number between 1 and 30");
  }

  const bookingDate = new Date(date);
  if (Number.isNaN(bookingDate.getTime())) {
    return badRequest(res, "date is invalid");
  }

  const booking = {
    id: `BK-${randomUUID().slice(0, 8).toUpperCase()}`,
    cafeId,
    cafeName: cafe.name,
    cafeArea: cafe.area,
    cafeImage: cafe.coverImage,
    name: String(name).trim(),
    phone: String(phone).trim(),
    date,
    time,
    guests: guestCount,
    specialRequest: specialRequest ? String(specialRequest).trim() : "",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);

  send(res, 201, booking);
}

function handleCancelBooking(req, res, id) {
  const bookings = readBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return notFound(res, "Booking not found");
  bookings[idx].status = "cancelled";
  writeBookings(bookings);
  send(res, 200, bookings[idx]);
}

// ---------- router ----------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = Object.fromEntries(url.searchParams.entries());
  const segments = url.pathname.split("/").filter(Boolean); // ['api','cafes', ':id']

  if (req.method === "OPTIONS") {
    return send(res, 204, {});
  }

  try {
    if (segments[0] !== "api") return notFound(res);

    if (segments[1] === "health" && req.method === "GET") {
      return send(res, 200, { status: "ok", cafes: cafes.length });
    }

    if (segments[1] === "filters" && req.method === "GET") {
      return handleFilters(req, res);
    }

    if (segments[1] === "cafes" && req.method === "GET" && !segments[2]) {
      return handleListCafes(req, res, query);
    }

    if (segments[1] === "cafes" && req.method === "GET" && segments[2]) {
      return handleGetCafe(req, res, decodeURIComponent(segments[2]));
    }

    if (segments[1] === "bookings" && req.method === "GET" && !segments[2]) {
      return handleGetBookings(req, res, query);
    }

    if (segments[1] === "bookings" && req.method === "POST" && !segments[2]) {
      return await handleCreateBooking(req, res);
    }

    if (
      segments[1] === "bookings" &&
      req.method === "DELETE" &&
      segments[2]
    ) {
      return handleCancelBooking(req, res, decodeURIComponent(segments[2]));
    }

    return notFound(res);
  } catch (err) {
    console.error(err);
    send(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Jaipur Hope API running on http://localhost:${PORT}`);
  console.log(`Loaded ${cafes.length} cafes`);
});
