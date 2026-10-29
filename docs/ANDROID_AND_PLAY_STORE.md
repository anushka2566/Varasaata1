# VARASAATA — Android & Google Play guide

Nothing here has been built or published yet. No AAB exists until you run the steps below yourself.

## 1. Backend & security

- The app uses Lovable Cloud for accounts, the database and auth emails. Only the public (publishable) key is in client code; every user table is protected by row-level security (users read/write only their own rows).
- Never put a service-role key or any secret into the Android bundle.
- Email verification is ON. Password reset sends a link to `/reset-password`. Add your final app/hosting URL to the auth redirect allow-list in Lovable (Users → Auth settings) before release.

## 2. Tables (see migration)

- `profiles` (auto-created on sign-up by a trigger): display name, avatar, stone colours, board theme, sound.
- `policy_consents`: user_id, privacy_policy_version, terms_version, accepted_at, consent_source.
- `game_stats`: per-match results.
  Bump `PRIVACY_POLICY_VERSION` / `TERMS_VERSION` in `src/lib/policies.ts` to force re-consent.

## 3. Packaging with Capacitor

The web app uses server rendering. For an offline-packaged APK you need a static client build (SPA mode). Simplest reliable option: publish the app in Lovable and point Capacitor at the HTTPS URL (`"server": { "url": "https://your-app.lovable.app" }` in `capacitor.config.json`), or configure SPA prerendering and use `webDir`.

```bash
bun add @capacitor/core @capacitor/android
bun add -d @capacitor/cli
bunx cap add android
bun run build
bunx cap sync android
bunx cap open android
```

In `android/variables.gradle` set `targetSdkVersion = 36` and `compileSdkVersion = 36` (check Play's current target-API requirement before release). Keep `minSdkVersion` separate (e.g. 24).

Icon: `public/assets/icon-512.png` (512×512). Use Android Studio → Image Asset to generate launcher icons. Create a 1024×500 feature graphic for the store listing.

## 4. Signed App Bundle (.aab)

Android Studio → Build → Generate Signed App Bundle → create a new keystore. **Back up the keystore file and passwords** in two safe places — losing it blocks updates (unless using Play App Signing, which is recommended). Choose `release` → `.aab`.

Test on a physical device: Android back button (shows the "Leave this game?" dialog), staying signed in after reopening, policy links, sound, timers, and airplane-mode behaviour.

## 5. Google Play checklist

- [ ] Public HTTPS Privacy Policy URL (`https://<your-domain>/privacy`) and Terms URL (`/terms`) — publish the app first; localhost or file paths are not accepted.
- [ ] Fill every `[placeholder]` in the policy pages (developer name, support email, deletion timeline, minimum age, jurisdiction).
- [ ] Data safety form: collects name, email (account management), app interactions/game stats (app functionality); encrypted in transit; user can request deletion; no ads, no analytics SDKs, no data sold. Google Fonts are loaded from Google.
- [ ] Account deletion: Play requires an in-app path and a web link for deletion requests — currently by email; consider adding a web deletion request form.
- [ ] Content rating questionnaire, target audience, "contains ads: No".
- [ ] Store listing: icon, ≥2 phone screenshots, feature graphic, short & full description, category Board.
- [ ] Developer account identity verification; new personal accounts must run a closed test (currently 12+ testers for 14 days) before production access.
- [ ] Support contact email.
      Play Console requirements change — re-check them before submitting.
