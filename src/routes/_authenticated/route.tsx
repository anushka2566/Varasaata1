import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Wrap a promise with a timeout that resolves to null after the given ms.
 * Used to prevent the beforeLoad from hanging forever when there is no network.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Timeout at 5 s — if Supabase doesn't respond (no network, slow cold
    // start) we redirect to sign-in rather than hanging forever on a loading
    // screen. The user can retry once the connection is restored.
    const result = await withTimeout(supabase.auth.getUser(), 5000);
    if (!result || result.error || !result.data.user) {
      throw redirect({ to: "/signin" });
    }
    return { user: result.data.user };
  },
  component: () => <Outlet />,
});
