import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { initAds } from "./lib/ads";
import "./styles.css";

// Render React immediately so the login screen is visible and inputs are
// interactive before any native plugin I/O runs.
const router = getRouter();
ReactDOM.createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);

// Guard against calling initAds() more than once. Both the deviceready
// listener path and the safety-net setTimeout share this flag.
let adsStarted = false;

function startAds() {
  if (adsStarted) return;
  adsStarted = true;
  initAds().catch(() => {
    /* non-fatal — game works without ads */
  });
}

// Initialize AdMob AFTER the "deviceready" event, which is Capacitor /
// Cordova's authoritative signal that the native bridge and all registered
// plugins are fully loaded and ready to receive calls.
// On web (no native bridge) this event is never fired, so initAds() is
// guarded by Capacitor.isNativePlatform() inside ads.ts and is a safe no-op.
if (document.readyState === "complete") {
  // The page already fired DOMContentLoaded, so listen for deviceready directly.
  document.addEventListener("deviceready", startAds, { once: true });
} else {
  // Wait for the DOM to be ready first, then wait for deviceready.
  window.addEventListener(
    "load",
    () => {
      document.addEventListener("deviceready", startAds, { once: true });
    },
    { once: true },
  );
}

// Safety net: if deviceready has not fired within 4 s (e.g., running in a
// plain browser during dev), kick off ads anyway so nothing is permanently
// blocked. Capacitor.isNativePlatform() inside ads.ts will still be false
// and the function returns immediately.
// The adsStarted guard above ensures this does NOT re-run if deviceready
// already fired.
setTimeout(() => {
  document.removeEventListener("deviceready", startAds);
  startAds();
}, 4000);
