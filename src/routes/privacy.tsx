import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Placeholder } from "@/components/LegalPage";
import { PRIVACY_POLICY_VERSION } from "@/lib/policies";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · VARASAATA" },
      {
        name: "description",
        content: "How the VARASAATA game collects, uses and protects your account and game data.",
      },
      { property: "og:title", content: "Privacy Policy · VARASAATA" },
      { property: "og:description", content: "How VARASAATA handles your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" version={PRIVACY_POLICY_VERSION}>
      <p>
        This policy explains what personal data the VARASAATA (వరసాట) game collects when you create
        an account and play, why, and your choices. VARASAATA is operated by{" "}
        <Placeholder>Developer name</Placeholder>.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your full name (shown as display name) and email address,
          provided at sign-up.
        </li>
        <li>
          <strong>Authentication data:</strong> your password is handled by our authentication
          provider and stored only as a secure hash. We never see or store your password in plain
          text. Sign-in sessions are kept on your device so you stay signed in.
        </li>
        <li>
          <strong>Profile and preferences:</strong> avatar, stone colours, board theme and sound
          setting.
        </li>
        <li>
          <strong>Policy consent records:</strong> the versions of this Privacy Policy and the Terms
          you accepted, and when.
        </li>
        <li>
          <strong>Game statistics:</strong> match results, rounds won and lost, game mode, computer
          difficulty and timestamps.
        </li>
      </ul>
      <p>We do not directly collect your location, contacts, photos, or payment data.</p>
      <p>
        <strong>Advertising (Android app).</strong> The Android app displays Google AdMob banners on
        the menu and interstitial ads after a completed match, never during active gameplay. AdMob
        may collect your device's advertising identifier, IP address, device information, and ad
        interactions to serve ads and measure performance; it may derive approximate location from
        your IP address. Ads are personalized only where you have provided the necessary consent.
        Where required by law, the app requests consent, which you can change through the ad privacy
        options. The web version does not display ads. For details, see the{" "}
        <a
          className="text-primary underline"
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Privacy Policy
        </a>{" "}
        and{" "}
        <a
          className="text-primary underline"
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          how Google uses data from partner sites and apps
        </a>
        .
      </p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To remember your preferences and show your statistics.</li>
        <li>To record that you accepted our policies, as required before play.</li>
        <li>To send account emails you request (sign-up confirmation, password reset).</li>
      </ul>

      <h2>3. Services that process your data</h2>
      <p>
        Accounts, the database and authentication emails run on Lovable Cloud, a hosted backend
        service. Data is transmitted over encrypted HTTPS connections. Fonts are loaded from Google
        Fonts, which may receive your IP address when the page loads. Advertising is provided by
        Google AdMob; see the advertising data disclosure under Section 1 above for details of what
        AdMob may collect. We do not sell or share your data with anyone else, except where required
        by law.
      </p>

      <h2>4. Security</h2>
      <p>
        Each user's profile, consent records and statistics are protected by database access rules
        so that only you can read them. No system is perfectly secure; we cannot guarantee absolute
        security, but we take reasonable measures to protect your data.
      </p>

      <h2>5. Retention</h2>
      <p>
        We keep your account data for as long as your account exists. Consent records are kept as
        proof of acceptance while your account exists. When your account is deleted, your profile,
        statistics and consent records are deleted, except where retention is legally required.
      </p>

      <h2>6. Account and data deletion</h2>
      <p>
        To delete your account and all associated data, email{" "}
        <Placeholder>support email address</Placeholder> from the address you registered with, with
        the subject "Delete my VARASAATA account". We will confirm deletion within{" "}
        <Placeholder>number</Placeholder> days. You can also request a copy or correction of your
        data the same way.
      </p>

      <h2>7. Children</h2>
      <p>
        VARASAATA is a general-audience game. <Placeholder>Minimum age, e.g. 13</Placeholder> or
        older may create an account. If you believe a child has provided data without permission,
        contact us and we will delete it.
      </p>

      <h2>8. Changes</h2>
      <p>
        If we change this policy we will update the version above and ask you to accept the new
        version before you continue playing.
      </p>

      <h2>9. Contact</h2>
      <p>
        Developer: <Placeholder>Developer name</Placeholder>
        <br />
        Email: <Placeholder>support email address</Placeholder>
        <br />
        Address: <Placeholder>postal address, if required</Placeholder>
      </p>
    </LegalPage>
  );
}
