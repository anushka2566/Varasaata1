import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Placeholder } from "@/components/LegalPage";
import { TERMS_VERSION } from "@/lib/policies";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · VARASAATA" },
      {
        name: "description",
        content: "The terms for using the VARASAATA traditional strategy game.",
      },
      { property: "og:title", content: "Terms & Conditions · VARASAATA" },
      { property: "og:description", content: "Terms for using VARASAATA." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & Conditions" version={TERMS_VERSION}>
      <p>
        These terms apply to your use of VARASAATA (వరసాట), provided by{" "}
        <Placeholder>Developer name</Placeholder>. By creating an account and accepting these terms,
        you agree to them.
      </p>

      <h2>1. The game</h2>
      <p>
        VARASAATA is a free digital version of a traditional stone strategy game, played locally
        between two people or against the computer. It is provided for entertainment only. There are
        no prizes, wagers or real-money features.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>Provide accurate information and keep your password confidential.</li>
        <li>You are responsible for activity on your account.</li>
        <li>Tell us promptly if you suspect unauthorised use.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>
        Do not misuse the service: no attempts to access other users' data, disrupt the service,
        reverse-engineer the backend, use offensive display names, or automate account creation.
      </p>

      <h2>4. Scores and statistics</h2>
      <p>
        The board and the score of a match in progress exist only on your device. Completed match
        results are saved to your account as statistics. Statistics are informational and may be
        reset or changed if the game rules or service change.
      </p>

      <h2>5. Availability and changes</h2>
      <p>
        We may update, change or discontinue features at any time. The service may be unavailable at
        times due to maintenance, network issues or matters beyond our control.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The traditional game itself is part of shared cultural heritage. The VARASAATA name, logo,
        artwork and software are owned by <Placeholder>Developer name</Placeholder>. You may use the
        app for personal, non-commercial play; you may not copy, resell or redistribute it.
      </p>

      <h2>7. Suspension and deletion</h2>
      <p>
        You may ask us to delete your account at any time (see the Privacy Policy). We may suspend
        or delete accounts that break these terms, after notice where reasonably possible.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        To the extent permitted by applicable law, the game is provided "as is" without warranties,
        and we are not liable for indirect losses arising from its use. Nothing in these terms
        limits rights you have under consumer law that cannot be excluded.
      </p>

      <h2>9. Updates to these terms</h2>
      <p>
        If we change these terms we will update the version above and ask you to accept the new
        version before you continue playing.
      </p>

      <h2>10. Contact</h2>
      <p>
        Email: <Placeholder>support email address</Placeholder>. Governing law:{" "}
        <Placeholder>jurisdiction</Placeholder>.
      </p>
    </LegalPage>
  );
}
