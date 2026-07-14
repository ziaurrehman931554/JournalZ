import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { registerServiceWorker } from "./services/notifications";
import "./index.css";

registerServiceWorker();

let deferredPrompt: Event | null = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

export function getDeferredPrompt() {
  const p = deferredPrompt;
  deferredPrompt = null;
  return p;
}

const basename = import.meta.env.BASE_URL.replace(/\/+$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
