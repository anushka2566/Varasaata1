import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError } from "@/components/brand";
import { EMAIL_RE, friendlyAuthError, normalizeEmail } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password · VARASAATA" },
      { name: "description", content: "Request a password reset link for your VARASAATA account." },
      { property: "og:title", content: "Reset password · VARASAATA" },
      { property: "og:description", content: "Request a password reset link." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = normalizeEmail(email);
    if (!EMAIL_RE.test(em)) return setError("Enter a valid email address.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(em, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return setError(friendlyAuthError(error.message));
    setSent(true);
  };

  return (
    <AuthShell title="Forgot your password?">
      {sent ? (
        <p className="text-center text-muted-foreground">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm">
        <Link to="/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
