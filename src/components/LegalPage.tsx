import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo, Title, LegalLinks } from "@/components/brand";

export function LegalPage({
  title,
  version,
  children,
}: {
  title: string;
  version: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <button
        onClick={() =>
          window.history.length > 1 ? router.history.back() : router.navigate({ to: "/" })
        }
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-8 flex items-center gap-4">
        <Logo size={72} />
        <Title small />
      </div>
      <article className="panel space-y-5 p-6 leading-relaxed sm:p-10 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:text-primary [&_li]:ml-5 [&_li]:list-disc [&_p]:text-foreground/90">
        <h1 className="text-3xl text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">Version {version}</p>
        {children}
      </article>
      <LegalLinks className="mt-8" />
      <p className="mt-2 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
      </p>
    </main>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-primary/20 px-1 text-primary">[{children}]</mark>;
}
