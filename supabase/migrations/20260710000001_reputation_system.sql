-- Create tier_thresholds config table
CREATE TABLE public.tier_thresholds (
  tier text PRIMARY KEY CHECK (tier IN ('Reader', 'Contributor', 'Trader', 'Admin')),
  min_reputation numeric NOT NULL,
  min_contributions integer DEFAULT 0 NOT NULL
);

-- Seed initial config thresholds
INSERT INTO public.tier_thresholds (tier, min_reputation, min_contributions) VALUES
  ('Reader', 0, 0),
  ('Contributor', 25, 3),
  ('Trader', 75, 0);

-- Enable RLS for tier_thresholds
ALTER TABLE public.tier_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tier thresholds are viewable by everyone" ON public.tier_thresholds
  FOR SELECT USING (true);

-- Function to automatically sync profiles.reputation_score
CREATE OR REPLACE FUNCTION public.sync_reputation_score()
RETURNS trigger AS $$
DECLARE
  v_profile_id uuid;
  v_score numeric;
  v_new_tier text;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_profile_id := old.profile_id;
  ELSE
    v_profile_id := new.profile_id;
  END IF;

  -- Calculate sum of all deltas for the profile
  SELECT COALESCE(sum(delta), 0)
  INTO v_score
  FROM public.reputation_events
  WHERE profile_id = v_profile_id;

  -- Simple tier calculation based on score thresholds for Phase 1
  -- (We will enrich this with contribution counts in Phase 3)
  IF v_score >= 75 THEN
    v_new_tier := 'Trader';
  ELSIF v_score >= 25 THEN
    v_new_tier := 'Contributor';
  ELSE
    v_new_tier := 'Reader';
  END IF;

  -- Update profiles with the new score and tier (ignoring Admin manually assigned ones)
  UPDATE public.profiles
  SET 
    reputation_score = v_score,
    permission_tier = CASE 
      WHEN permission_tier = 'Admin' THEN 'Admin'
      ELSE v_new_tier
    END,
    updated_at = timezone('utc'::text, now())
  WHERE id = v_profile_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute sync_reputation_score on reputation event insert/update/delete
CREATE TRIGGER trigger_sync_reputation_score
  AFTER INSERT OR UPDATE OR DELETE ON public.reputation_events
  FOR EACH ROW EXECUTE FUNCTION public.sync_reputation_score();
