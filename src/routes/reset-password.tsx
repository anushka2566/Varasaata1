import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError, PasswordInput } from "@/components/brand";
import { friendlyAuthError, validatePassword } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password · VARASAATA" },
      { name: "description", content: "Choose a new password for your VARASAATA account." },
      { property: "og:title", content: "Set new password · VARASAATA" },
      { property: "og:description", content: "Choose a new password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: d }) => {
      if (d.session && isRecovery) setReady(true);
      else if (d.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validatePassword(pw);
    if (v) return setError(v);
    if (pw !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return setError(friendlyAuthError(error.message));
    navigate({ to: "/play" });
  };

  return (
    <AuthShell title="Set a new password">
      {!ready ? (
        <p className="text-center text-muted-foreground">
          Open this page from the reset link in your email. Waiting for a valid link…
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="pw">New password</Label>
            <PasswordInput
              id="pw"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cf">Confirm password</Label>
            <PasswordInput
              id="cf"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
