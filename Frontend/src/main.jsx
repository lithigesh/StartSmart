import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
// import { HomePage } from "./LandingPage/HomePage.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
