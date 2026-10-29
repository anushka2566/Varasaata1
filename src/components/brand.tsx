import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export const LOGO_SRC = "/assets/varasaata-logo.png";

export function Logo({ size = 120 }: { size?: number }) {
  return (
    <img
      src={LOGO_SRC}
      alt="VARASAATA logo"
      width={size}
      height={size}
      // fetchpriority=high tells the browser to prioritise this image so it
      // arrives before first paint, eliminating the reflow-after-load that
      // could cause the Android WebView to lose input focus.
      fetchPriority="high"
      // Decode on a background thread to avoid blocking the main thread.
      decoding="async"
      className="drop-shadow-xl"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export function Title({ small }: { small?: boolean }) {
  return (
    <div className="text-center">
      <div
        className={`font-telugu font-bold text-gold-gradient ${small ? "text-2xl" : "text-4xl"}`}
      >
        వరసాట
      </div>
      <div
        className={`font-display tracking-[0.35em] text-muted-foreground ${small ? "text-xs" : "text-sm"}`}
      >
        VARASAATA
      </div>
    </div>
  );
}

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Logo size={96} />
          <Title small />
          <h1 className="mt-3 text-xl text-foreground">{title}</h1>
        </div>
        {children}
        <LegalLinks className="mt-6" />
      </div>
    </main>
  );
}

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`flex justify-center gap-4 text-xs text-muted-foreground ${className}`}>
      <Link to="/privacy" className="underline-offset-4 hover:text-primary hover:underline">
        Privacy Policy
      </Link>
      <span aria-hidden>·</span>
      <Link to="/terms" className="underline-offset-4 hover:text-primary hover:underline">
        Terms &amp; Conditions
      </Link>
    </nav>
  );
}

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-primary"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-destructive">
      {children}
    </p>
  );
}
