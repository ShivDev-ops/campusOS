-- Fix recursive RLS checks for chat tables by using a security definer helper.

CREATE OR REPLACE FUNCTION public.is_chat_room_member(room_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_room_members
    WHERE room_id = room_uuid
      AND profile_id = user_uuid
  )
$$;

DROP POLICY IF EXISTS "Users can view rooms they are members of" ON public.chat_rooms;
DROP POLICY IF EXISTS "Users can view members of their rooms" ON public.chat_room_members;
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages in their rooms" ON public.chat_messages;

CREATE POLICY "Users can view rooms they are members of" ON public.chat_rooms
  FOR SELECT USING (
    public.is_chat_room_member(chat_rooms.id, auth.uid())
  );

CREATE POLICY "Users can view members of their rooms" ON public.chat_room_members
  FOR SELECT USING (
    public.is_chat_room_member(chat_room_members.room_id, auth.uid())
  );

CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
  FOR SELECT USING (
    public.is_chat_room_member(chat_messages.room_id, auth.uid())
  );

CREATE POLICY "Users can send messages in their rooms" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND public.is_chat_room_member(chat_messages.room_id, auth.uid())
  );
