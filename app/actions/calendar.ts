'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCalendarEventAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const eventDateStr = formData.get('event_date') as string
  const department = formData.get('department') as string

  if (!title || !eventDateStr || !department) {
    return { error: 'Required fields missing.' }
  }

  const event_date = new Date(eventDateStr).toISOString()

  const { error } = await supabase
    .from('calendar_events')
    .insert({
      creator_id: user.id,
      title,
      description,
      event_date,
      department,
      status: 'pending' // Enforced by RLS anyway
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/calendar')
  redirect('/calendar')
}

export async function approveCalendarEventAction(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Double check admin privilege
  const { data: profile } = await supabase
    .from('profiles')
    .select('permission_tier')
    .eq('id', user.id)
    .single()

  if (profile?.permission_tier !== 'Admin') {
    return { error: 'Unauthorized. Only admins can approve events.' }
  }

  const { error } = await supabase
    .from('calendar_events')
    .update({ status: 'approved' })
    .eq('id', eventId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/calendar')
  revalidatePath('/admin/calendar')
  return { success: 'Event approved successfully.' }
}

export async function rejectCalendarEventAction(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Double check admin privilege
  const { data: profile } = await supabase
    .from('profiles')
    .select('permission_tier')
    .eq('id', user.id)
    .single()

  if (profile?.permission_tier !== 'Admin') {
    return { error: 'Unauthorized. Only admins can reject events.' }
  }

  const { error } = await supabase
    .from('calendar_events')
    .update({ status: 'rejected' })
    .eq('id', eventId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/calendar')
  revalidatePath('/admin/calendar')
  return { success: 'Event rejected successfully.' }
}
