-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  department text,
  year integer,
  reputation_score numeric DEFAULT 0 NOT NULL,
  permission_tier text DEFAULT 'Reader' NOT NULL CHECK (permission_tier IN ('Reader', 'Contributor', 'Trader', 'Admin')),
  skill_tags text[] DEFAULT '{}'::text[] NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create handle_new_user function for auth trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, department, year, reputation_score, permission_tier, skill_tags)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'department', ''),
    COALESCE((new.raw_user_meta_data->>'year')::integer, 1),
    0,
    'Reader',
    '{}'::text[]
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create reputation_events table
CREATE TABLE public.reputation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  delta numeric NOT NULL,
  reason_code text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reputation_events
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;

-- Reputation events RLS Policies
CREATE POLICY "Reputation events are viewable by everyone" ON public.reputation_events
  FOR SELECT USING (true);
