import { supabase } from "@/integrations/supabase/client";

/** Bump either version to require every user to re-consent before playing. */
export const PRIVACY_POLICY_VERSION = "2026-10-19"; // bumped: added Google AdMob advertising disclosure
export const TERMS_VERSION = "2026-10-16";

export async function hasCurrentConsent(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("policy_consents")
    .select("id")
    .eq("user_id", userId)
    .eq("privacy_policy_version", PRIVACY_POLICY_VERSION)
    .eq("terms_version", TERMS_VERSION)
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function recordConsent(userId: string) {
  const { error } = await supabase.from("policy_consents").upsert(
    {
      user_id: userId,
      privacy_policy_version: PRIVACY_POLICY_VERSION,
      terms_version: TERMS_VERSION,
      consent_source: "web",
    },
    { onConflict: "user_id,privacy_policy_version,terms_version", ignoreDuplicates: true },
  );
  if (error) throw error;
}
