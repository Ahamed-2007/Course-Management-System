import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { CourseProvider } from "./context/CourseContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CourseProvider>
        <App />
      </CourseProvider>
    </BrowserRouter>
  </StrictMode>
);
