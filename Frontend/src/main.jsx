import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { HomePage } from "./LandingPage/HomePage.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
