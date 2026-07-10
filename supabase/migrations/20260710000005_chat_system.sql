-- Create chat_rooms table
CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  type text DEFAULT 'direct' NOT NULL CHECK (type IN ('group', 'direct')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_room_members table
CREATE TABLE public.chat_room_members (
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (room_id, profile_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_rooms
CREATE POLICY "Users can view rooms they are members of" ON public.chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members 
      WHERE room_id = chat_rooms.id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert direct or group rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (true);

-- Policies for chat_room_members
CREATE POLICY "Users can view members of their rooms" ON public.chat_room_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members m
      WHERE m.room_id = chat_room_members.room_id AND m.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON public.chat_room_members
  FOR INSERT WITH CHECK (profile_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.chat_rooms r WHERE r.id = room_id AND r.type = 'group'
  ));

-- Policies for chat_messages
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_messages.room_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their rooms" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_messages.room_id AND profile_id = auth.uid()
    )
  );

-- Seed default group rooms for departments
INSERT INTO public.chat_rooms (id, name, type) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Comp-Sci Hub', 'group'),
  ('c0000000-0000-0000-0000-000000000002', 'Electronics Hub', 'group'),
  ('c0000000-0000-0000-0000-000000000003', 'Mechanical Hub', 'group'),
  ('c0000000-0000-0000-0000-000000000004', 'Chemical Hub', 'group'),
  ('c0000000-0000-0000-0000-000000000005', 'Civil Hub', 'group'),
  ('c0000000-0000-0000-0000-000000000006', 'General Campus', 'group')
ON CONFLICT (id) DO NOTHING;
