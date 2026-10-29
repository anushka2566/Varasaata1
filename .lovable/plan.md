# VARASAATA local and downloadable versions

## Goals

- Replace the supplied developer-name and support-email placeholders in the Privacy Policy and Terms; leave details the owner has not supplied unchanged.
- Add a guest game that works offline, including the computer opponent, game settings, and device-only match statistics, without weakening the existing sign-in, consent, or account-data protections.
- Prepare Android (Capacitor) and desktop (Electron) builds, and add safe offline web-app caching where compatible with the existing Lovable preview and hosted app.
- Verify gameplay and document which features need an internet connection and which platform builds can be produced in this environment.

## Approach

- Keep signed-in cloud play as-is and introduce a separate guest entry point. Store only guest preferences and guest results on the device; do not silently upload or mix them with account records.
- Use a guarded generated service worker for installed-web offline support, and keep Electron files/configuration separate from the game rules and UI.
- Use the existing game engine for all play modes. Record the new persistence/build boundaries in the project guidance and update the Android/desktop release guide.
- Run the game tests, preview checks, and available builds. Android signing or device verification will be called out as pending if the required SDK/device tools are unavailable.

## Technical details

- Keep rules in `src/game/engine.ts`; add a small browser-safe local-data module and a public guest-game page.
- Preserve `/play` consent enforcement and existing Cloud RLS. Guest sessions never write to Cloud.
- Use `vite-plugin-pwa` with preview/dev registration safeguards for web offline caching. Package the desktop build with Electron and the existing Capacitor setup for Android.
- Internet remains necessary for account registration/sign-in, email links, Cloud profile/stat synchronization, and ads; guest board play and guest data remain device-local.
