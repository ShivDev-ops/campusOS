'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListingAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // 1. Check user tier is Trader or Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('permission_tier')
    .eq('id', user.id)
    .single()

  if (profile?.permission_tier !== 'Trader' && profile?.permission_tier !== 'Admin') {
    return { error: 'Write-heavy actions like listing an item are restricted to the Trader tier.' }
  }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const priceStr = formData.get('price') as string
  const condition = formData.get('condition') as string
  const description = formData.get('description') as string
  const price = priceStr ? parseFloat(priceStr) : 0

  if (!title || !category || !priceStr || !condition) {
    return { error: 'Please fill in all required fields.' }
  }

  // Handle files
  const files = formData.getAll('images') as File[]
  const imageUrls: string[] = []

  for (const file of files) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `listings/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data, error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true
        })

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError)
        return { error: `Failed to upload image: ${uploadError.message}` }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath)

      imageUrls.push(publicUrl)
    }
  }

  // 2. Insert listing
  const { error } = await supabase
    .from('listings')
    .insert({
      seller_id: user.id,
      title,
      category,
      price,
      condition,
      description,
      images: imageUrls,
      status: 'active'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/marketplace')
  redirect('/marketplace')
}

export async function markAsSoldAction(listingId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: 'sold' })
    .eq('id', listingId)
    .eq('seller_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${listingId}`)
  return { success: 'Listing marked as sold.' }
}

export async function reportListingAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const listingId = formData.get('listingId') as string
  const reason = formData.get('reason') as string
  const description = formData.get('description') as string

  if (!listingId || !reason) {
    return { error: 'Required fields missing.' }
  }

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      entity_type: 'listing',
      entity_id: listingId,
      reason,
      description,
      status: 'open'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${listingId}`)
  return { success: 'Report submitted successfully. Safe-mode checking active.' }
}
