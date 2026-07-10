'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function grantDevReputation(points: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Insert a test reputation event
  const { error } = await supabase.from('reputation_events').insert({
    profile_id: user.id,
    delta: points,
    reason_code: 'DEV_TEST_GRANT',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/marketplace')
  revalidatePath('/marketplace/create')

  return { success: `Successfully granted ${points} reputation points!` }
}

export async function resetDevReputation() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Delete all reputation events for this user
  const { error } = await supabase
    .from('reputation_events')
    .delete()
    .eq('profile_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/marketplace')
  revalidatePath('/marketplace/create')

  return { success: 'Successfully reset reputation!' }
}
