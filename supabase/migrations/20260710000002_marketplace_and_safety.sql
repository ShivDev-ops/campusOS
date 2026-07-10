-- Create listings table
CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('books', 'electronics', 'misc')),
  title text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  condition text NOT NULL CHECK (condition IN ('New', 'Like New', 'Good', 'Fair')),
  description text,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'sold', 'hidden')),
  images text[] DEFAULT '{}'::text[] NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone" ON public.listings
  FOR SELECT USING (status != 'hidden' OR auth.uid() = seller_id);

CREATE POLICY "Traders can insert listings" ON public.listings
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND permission_tier IN ('Trader', 'Admin')
    )
  );

CREATE POLICY "Sellers can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = seller_id);

-- Create lost_found_items table
CREATE TABLE public.lost_found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('lost', 'found')),
  title text NOT NULL,
  description text,
  location text,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'resolved')),
  image_url text,
  occurred_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for lost_found_items
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lost and found items are viewable by everyone" ON public.lost_found_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert lost and found reports" ON public.lost_found_items
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can update their own reports" ON public.lost_found_items
  FOR UPDATE USING (auth.uid() = reporter_id);

-- Create reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('listing', 'profile', 'message')),
  entity_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('scam', 'inappropriate', 'spam', 'harassment')),
  description text,
  status text DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'resolved')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submitted reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND permission_tier = 'Admin'
  ));

CREATE POLICY "Users can submit reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Auto-hide trigger function for listings with >= 3 open reports
CREATE OR REPLACE FUNCTION public.check_listing_reports()
RETURNS trigger AS $$
DECLARE
  v_open_reports_count integer;
BEGIN
  IF new.entity_type = 'listing' THEN
    -- Count open reports against this listing
    SELECT count(*)
    INTO v_open_reports_count
    FROM public.reports
    WHERE entity_type = 'listing' AND entity_id = new.entity_id AND status = 'open';

    -- Auto-hide if open reports reach 3
    IF v_open_reports_count >= 3 THEN
      UPDATE public.listings
      SET status = 'hidden'
      WHERE id = new.entity_id;
    END IF;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on reports insert
CREATE TRIGGER trigger_check_listing_reports
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.check_listing_reports();
