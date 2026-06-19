const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body;
}

export function getCafes(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null)
  ).toString();
  return request(`/api/cafes${query ? `?${query}` : ""}`);
}

export function getCafe(id) {
  return request(`/api/cafes/${encodeURIComponent(id)}`);
}

export function getFilters() {
  return request("/api/filters");
}

export function getBookingsByPhone(phone) {
  return request(`/api/bookings?phone=${encodeURIComponent(phone)}`);
}

export function createBooking(payload) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(id) {
  return request(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
