-- Create calendar_events table
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  department text NOT NULL CHECK (department IN ('CSE', 'ECE', 'MECH', 'CHEM', 'CIVIL', 'ALL')),
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Approved calendar events are viewable by everyone" ON public.calendar_events
  FOR SELECT USING (
    status = 'approved' 
    OR auth.uid() = creator_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND permission_tier = 'Admin'
    )
  );

-- Insert policies
CREATE POLICY "Users can insert calendar events" ON public.calendar_events
  FOR INSERT WITH CHECK (auth.uid() = creator_id AND status = 'pending');

-- Update policies
CREATE POLICY "Creators or admins can update calendar events" ON public.calendar_events
  FOR UPDATE USING (
    auth.uid() = creator_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND permission_tier = 'Admin'
    )
  );
