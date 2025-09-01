import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <Home />
  </StrictMode>
);
