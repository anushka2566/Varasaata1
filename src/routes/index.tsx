import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo, Title, LegalLinks } from "@/components/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "వరసాట · VARASAATA — Traditional Stone Strategy Game" },
      {
        name: "description",
        content:
          "Play Varasaata, the traditional mill-forming stone game, against a friend or the computer.",
      },
      { property: "og:title", content: "వరసాట · VARASAATA" },
      { property: "og:description", content: "The traditional mill-forming stone strategy game." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/play", replace: true });
    });
  }, [navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <Logo size={220} />
      <Title />
      <p className="max-w-md text-lg text-muted-foreground">
        Place your nine stones, form lines of three, and capture your rival's gems. A timeless game
        of patience and cunning.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button asChild size="lg">
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
      <LegalLinks />
    </main>
  );
}
