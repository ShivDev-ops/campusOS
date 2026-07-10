'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLostFoundAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const type = formData.get('type') as string // 'lost' | 'found'
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const occurredAtStr = formData.get('occurred_at') as string

  if (!title || !type || !location) {
    return { error: 'Please fill in all required fields.' }
  }

  const occurred_at = occurredAtStr ? new Date(occurredAtStr).toISOString() : new Date().toISOString()

  // Handle file upload
  const file = formData.get('image') as File
  let imageUrl: string | null = null

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `lost-found/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('listings')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError)
      return { error: `Failed to upload image: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listings')
      .getPublicUrl(filePath)

    imageUrl = publicUrl
  }

  // Insert item
  const { error } = await supabase
    .from('lost_found_items')
    .insert({
      reporter_id: user.id,
      title,
      type,
      description,
      location,
      image_url: imageUrl,
      occurred_at,
      status: 'active'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/lost-found')
  redirect('/lost-found')
}

export async function resolveLostFoundAction(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('lost_found_items')
    .update({ status: 'resolved' })
    .eq('id', itemId)
    .eq('reporter_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/lost-found')
  return { success: 'Item marked as resolved!' }
}
