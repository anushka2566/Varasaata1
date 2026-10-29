CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Player' CHECK (char_length(display_name) BETWEEN 1 AND 60),
  avatar text NOT NULL DEFAULT '🦚',
  p1_color text NOT NULL DEFAULT 'emerald',
  p2_color text NOT NULL DEFAULT 'ruby',
  board_theme text NOT NULL DEFAULT 'wood' CHECK (board_theme IN ('wood','midnight','jade')),
  sound_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.policy_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  privacy_policy_version text NOT NULL,
  terms_version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  consent_source text NOT NULL DEFAULT 'web',
  UNIQUE (user_id, privacy_policy_version, terms_version)
);
CREATE INDEX policy_consents_user_idx ON public.policy_consents(user_id);
GRANT SELECT, INSERT ON public.policy_consents TO authenticated;
GRANT ALL ON public.policy_consents TO service_role;
ALTER TABLE public.policy_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own consent read" ON public.policy_consents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own consent insert" ON public.policy_consents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mode text NOT NULL CHECK (mode IN ('local','ai')),
  difficulty text,
  result text NOT NULL CHECK (result IN ('win','loss','draw')),
  rounds_total int NOT NULL CHECK (rounds_total IN (1,3,5,7)),
  rounds_won int NOT NULL DEFAULT 0,
  rounds_lost int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX game_stats_user_idx ON public.game_stats(user_id, created_at DESC);
GRANT SELECT, INSERT ON public.game_stats TO authenticated;
GRANT ALL ON public.game_stats TO service_role;
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own stats read" ON public.game_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own stats insert" ON public.game_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(left(trim(NEW.raw_user_meta_data->>'display_name'), 60), ''), 'Player'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();