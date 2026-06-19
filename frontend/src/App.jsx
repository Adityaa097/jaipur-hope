import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import CafeDetail from "./pages/CafeDetail.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import SavedCafes from "./pages/SavedCafes.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
        <Route path="/cafe/:id/book" element={<BookingPage />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/saved" element={<SavedCafes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
