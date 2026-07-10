'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getOrCreateDirectChat(targetProfileId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (user.id === targetProfileId) {
    return { error: "You cannot initiate a chat room with yourself." }
  }

  // 1. Check if direct chat already exists between user.id and targetProfileId
  const { data: existingMemberships, error: checkError } = await supabase
    .from('chat_room_members')
    .select('room_id, chat_rooms!inner(type)')
    .eq('profile_id', user.id)
    .eq('chat_rooms.type', 'direct')

  if (checkError) {
    return { error: checkError.message }
  }

  // Look for a room that also contains targetProfileId
  if (existingMemberships && existingMemberships.length > 0) {
    const roomIds = existingMemberships.map(m => m.room_id)
    const { data: commonMembers } = await supabase
      .from('chat_room_members')
      .select('room_id')
      .in('room_id', roomIds)
      .eq('profile_id', targetProfileId)

    if (commonMembers && commonMembers.length > 0) {
      // Direct room already exists
      return { roomId: commonMembers[0].room_id }
    }
  }

  // 2. Create new direct room
  const { data: newRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .insert({
      type: 'direct'
    })
    .select()
    .single()

  if (roomError) {
    return { error: roomError.message }
  }

  // 3. Add members
  const { error: membersError } = await supabase
    .from('chat_room_members')
    .insert([
      { room_id: newRoom.id, profile_id: user.id },
      { room_id: newRoom.id, profile_id: targetProfileId }
    ])

  if (membersError) {
    return { error: membersError.message }
  }

  revalidatePath('/chat')
  return { roomId: newRoom.id }
}

export async function sendMessageAction(roomId: string, content: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (!content.trim()) {
    return { error: 'Content cannot be empty.' }
  }

  const { error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: user.id,
      content: content.trim()
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/chat?room=${roomId}`)
  return { success: true }
}

export async function joinGroupChat(roomId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify room is group
  const { data: room } = await supabase
    .from('chat_rooms')
    .select('type')
    .eq('id', roomId)
    .single()

  if (room?.type !== 'group') {
    return { error: 'Can only auto-join group chat rooms.' }
  }

  const { error } = await supabase
    .from('chat_room_members')
    .insert({
      room_id: roomId,
      profile_id: user.id
    })
    .select()

  if (error && !error.message.includes('duplicate key')) {
    return { error: error.message }
  }

  revalidatePath('/chat')
  return { success: true }
}
