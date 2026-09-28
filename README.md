<div align="center">

# ☕ Jaipur Hope

## 📌 Overview

**Jaipur Hope** is a full-stack café discovery and table-booking platform designed around the experience of finding and reserving cafés in Jaipur.

The application combines a searchable café catalogue, multi-parameter filtering, café detail pages, saved cafés, and an end-to-end reservation workflow.

The project demonstrates practical full-stack development concepts including:

* REST API design
* React component architecture
* Server-side search and filtering
* Data normalization and ETL
* Form validation
* Client-side persistence
* Pagination
* File-based data persistence
* Responsive UI development
* API integration

### 🎯 Problem

Café discovery and table reservations are often fragmented across search engines, maps, social media and phone calls.

### 💡 Solution

Jaipur Hope provides a single platform where users can:

**Search → Filter → Explore → Save → Book**

### 📊 Project Scale

| Metric   | Details                   |
| -------- | ------------------------- |
| Cafés    | **282 curated cafés**     |
| Areas    | **19 Jaipur areas**       |
| Themes   | **18 themes**             |
| Cuisines | **14 cuisine categories** |
| Frontend | React 18 + Vite           |
| Backend  | Node.js REST API          |
| Data     | JSON-based datastore      |

---

# ✨ Key Features

## 🔍 Café Discovery

* Full-text café search
* Search by café name, area, cuisine, theme and keywords
* Multi-parameter filtering
* Filter by:

  * Area
  * Theme
  * Cuisine
  * Best-for category
  * Minimum rating
* Amenity-based filtering:

  * 🐾 Pet friendly
  * 💑 Couple friendly
  * 👨‍👩‍👧 Family friendly
  * 🌇 Rooftop seating
  * 🌳 Outdoor seating
  * 🌱 Vegan options
* Multiple sorting options
* Server-side pagination

### Sorting Options

* Featured
* Rating
* Aesthetic score
* Review count
* Name

---

## 📅 Table Reservation

The application provides an end-to-end booking workflow:

**Café → Booking Form → Validation → Confirmation**

Features include:

* Reservation form
* Server-side input validation
* Date validation
* Guest count validation
* Unique booking IDs
* Booking confirmation
* Reservation lookup using phone number
* Booking cancellation
* Soft-delete booking mechanism

Example booking ID:

```text
BK-3F9A21C7
```

Guest capacity supported by the current API:

```text
1–30 guests
```

---

## ❤️ Saved Cafés

Users can save cafés for later.

Saved cafés are persisted using:

```text
localStorage
```

A custom React hook provides the persistence layer:

```text
useLocalStorage
useSavedCafes
```

The implementation also includes graceful fallback behavior when browser storage is unavailable.

---

## 🎨 Responsive Frontend

The frontend follows a responsive, mobile-first design approach.

### Mobile

* Bottom navigation
* Responsive café cards
* Filter sheet
* Touch-friendly interface

### Desktop

* Sidebar navigation
* Expanded filtering experience
* Responsive multi-column la
