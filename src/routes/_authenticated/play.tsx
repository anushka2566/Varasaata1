import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasCurrentConsent } from "@/lib/policies";
import { GameApp } from "@/components/game/GameApp";

export const Route = createFileRoute("/_authenticated/play")({
  head: () => ({
    meta: [
      { title: "Play · వరసాట VARASAATA" },
      { name: "description", content: "Play Varasaata against a friend or the computer." },
      { property: "og:title", content: "Play · VARASAATA" },
      { property: "og:description", content: "Play the traditional stone strategy game." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    if (!(await hasCurrentConsent(context.user.id))) throw redirect({ to: "/consent" });
  },
  component: Play,
});

function Play() {
  const { user } = Route.useRouteContext();
  return <GameApp userId={user.id} />;
}
