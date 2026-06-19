import React from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/Shared.jsx";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "60px 16px" }}>
      <EmptyState
        title="This street doesn't exist on our map"
        body="The page you're looking for wandered off somewhere in the Pink City."
        actionLabel="Back to Discover"
        onAction={() => navigate("/")}
      />
    </div>
  );
}
