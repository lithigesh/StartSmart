import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HomePage } from "./LandingPage/HomePage.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
