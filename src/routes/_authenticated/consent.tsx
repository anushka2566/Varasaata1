import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo, Title, FieldError } from "@/components/brand";
import { hasCurrentConsent, recordConsent } from "@/lib/policies";

export const Route = createFileRoute("/_authenticated/consent")({
  head: () => ({
    meta: [
      { title: "Welcome · VARASAATA" },
      { name: "description", content: "Review and accept the VARASAATA Privacy Policy and Terms." },
      { property: "og:title", content: "Welcome · VARASAATA" },
      { property: "og:description", content: "Accept the policies to start playing." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    if (await hasCurrentConsent(context.user.id)) throw redirect({ to: "/play" });
  },
  component: Consent,
});

function Consent() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const accept = async () => {
    setSaving(true);
    setError("");
    try {
      await recordConsent(user.id);
      navigate({ to: "/play" });
    } catch (e) {
      setError(
        e instanceof Error && /fetch/i.test(e.message)
          ? "You're offline. Please reconnect and try again."
          : "Couldn't save your consent. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-lg p-6 text-center sm:p-10">
        <div className="flex flex-col items-center gap-3">
          <Logo size={140} />
          <Title />
        </div>
        <h1 className="mt-6 text-2xl">Welcome to VARASAATA</h1>
        <p className="mt-2 text-muted-foreground">Before you play, please read our policies.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline">
            <Link to="/privacy">Privacy Policy</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/terms">Terms &amp; Conditions</Link>
          </Button>
        </div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-left">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <span>I have read and agree to the Privacy Policy and Terms &amp; Conditions.</span>
        </label>
        <FieldError>{error}</FieldError>
        <Button className="mt-6 w-full" size="lg" disabled={!agreed || saving} onClick={accept}>
          {saving ? "Saving…" : "Agree & Continue"}
        </Button>
      </div>
    </main>
  );
}
