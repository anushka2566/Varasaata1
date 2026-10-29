import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError, PasswordInput } from "@/components/brand";
import { friendlyAuthError, normalizeEmail, validatePassword } from "@/lib/auth";
import { recordConsent } from "@/lib/policies";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up · వరసాట VARASAATA" },
      {
        name: "description",
        content: "Create your VARASAATA account to play the traditional stone strategy game.",
      },
      { property: "og:title", content: "Sign Up · VARASAATA" },
      { property: "og:description", content: "Create your VARASAATA account." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  const handleName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, name: v }));
  }, []);

  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, email: v }));
  }, []);

  const handlePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, password: v }));
  }, []);

  const handleConfirm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, confirm: v }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const er: Record<string, string> = {};
    const name = f.name.trim();
    const rawEmail = f.email.trim();
    if (name.length < 2 || name.length > 60) er.name = "Enter your display name (2–60 characters).";
    if (rawEmail.length < 3) er.email = "Enter a valid username or email address.";
    const email = normalizeEmail(rawEmail);
    const pw = validatePassword(f.password);
    if (pw) er.password = pw;
    if (f.password !== f.confirm) er.confirm = "Passwords do not match.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    submitting.current = true;

    // Direct sign up without email verification requirement
    const { data, error } = await supabase.auth.signUp({
      email,
      password: f.password,
      options: {
        data: { display_name: name },
      },
    });

    if (error) {
      // If already registered, try signing in directly with provided credentials
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        const loginRes = await supabase.auth.signInWithPassword({
          email,
          password: f.password,
        });
        if (!loginRes.error && loginRes.data.user) {
          try {
            await recordConsent(loginRes.data.user.id);
          } catch {
            /* ignore consent errors */
          }
          submitting.current = false;
          setLoading(false);
          navigate({ to: "/play" });
          return;
        }
      }

      submitting.current = false;
      setLoading(false);
      return setErrors({ form: friendlyAuthError(error.message) });
    }

    // If session is present or user was created, ensure session and navigate directly to play
    let activeUser = data.user;
    if (!data.session) {
      const signInRes = await supabase.auth.signInWithPassword({
        email,
        password: f.password,
      });
      if (signInRes.data?.user) {
        activeUser = signInRes.data.user;
      }
    }

    if (activeUser) {
      try {
        await recordConsent(activeUser.id);
      } catch {
        /* auto consent fallback */
      }
    }

    submitting.current = false;
    setLoading(false);
    navigate({ to: "/play" });
  };

  return (
    <AuthShell title="Create your account">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="signup-name">Display Name</Label>
          <Input
            id="signup-name"
            autoComplete="name"
            placeholder="e.g. Anushka"
            value={f.name}
            onChange={handleName}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="signup-email">Username or Email</Label>
          <Input
            id="signup-email"
            type="text"
            autoComplete="username"
            placeholder="e.g. anushka or player@email.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={f.email}
            onChange={handleEmail}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="Enter password"
            value={f.password}
            onChange={handlePassword}
          />
          <FieldError>{errors.password}</FieldError>
        </div>
        <div>
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <PasswordInput
            id="signup-confirm"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={f.confirm}
            onChange={handleConfirm}
          />
          <FieldError>{errors.confirm}</FieldError>
        </div>
        <FieldError>{errors.form}</FieldError>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Sign Up & Play"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
