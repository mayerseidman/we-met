// ══════════════════════════════════════════════════════════════
// lib/db.js
// ══════════════════════════════════════════════════════════════
// All database read/write functions live here.
//
// WHY THIS EXISTS:
// Keeping database calls in one place means if we ever swap
// Supabase for something else, we only change this file.
// Components and hooks should never call supabase.from() directly.
//
// RULE: Never import supabase directly in a component.
// Always import and use functions from this file instead.
//
// FUNCTIONS:
// - saveUserProfile(userId, profile) — upsert profile to Supabase
// - getUserProfile(userId) — fetch profile from Supabase
// ══════════════════════════════════════════════════════════════

import { supabase } from './supabase'

// Save or update a user's profile in Supabase
// Uses upsert — inserts if no row exists, updates if it does
// userId must match auth.uid() for RLS to allow the write
export async function saveUserProfile(userId, profile) {
    const { data, error } = await supabase
        .from('users')
        .upsert({
            id: userId,          // must match auth.uid() for RLS
            name: profile.name,
            instagram: profile.instagram,
            phone: profile.phone,
            about: profile.about,
            location: profile.location,
            photo_url: profile.photo || null, // base64 for now, URL later
        })
        .select()

    if (error) {
        console.error('Error saving profile to Supabase:', error)
        return { success: false, error }
    }

    return { success: true, data }
}

// Fetch a user's profile from Supabase
// Returns null if no profile exists yet
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile from Supabase:', error)
        return null
    }

    return data
}

// Check if a meet already exists in Supabase
// Used to prevent duplicate meets when syncing
// Checks by connectedUserId if available, otherwise by name + phone
export async function meetExists(userId, connectedUserId, name, phone) {
    console.log('meetExists checking:', { userId, connectedUserId, name, phone })
    let query = supabase
        .from('meets')
        .select('id')
        .eq('owner_id', userId)

    if (connectedUserId) {
        query = query.eq('connected_user_id', connectedUserId)
    } else {
        query = query.eq('name', name).eq('phone', phone)
    }

    const { data, error } = await query.limit(1)
    console.log('meetExists result:', { data, error })
    return data && data.length > 0
}

// Upload a photo to Supabase Storage and return the public URL
// Takes a base64 string and userId, returns { url, error }
export async function uploadAvatar(userId, base64) {
    console.log('uploadAvatar called for user:', userId)
    // Convert base64 to a blob for upload
    const base64Data = base64.split(',')[1]
    const mimeType = base64.split(';')[0].split(':')[1]
    const blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(r => r.blob())
    
    const filePath = `${userId}/avatar.${mimeType.split('/')[1]}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
            upsert: true, // overwrite if exists
            contentType: mimeType,
        })

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return { url: null, error: uploadError }
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    return { url: data.publicUrl, error: null }
}

// Save a meet to Supabase
// Called after scanning someone's QR code
export async function saveMeet(userId, meet) {
    console.log('saveMeet called with:', meet)
    const { data, error } = await supabase
        .from('meets')
        .insert({
            owner_id: userId,
            connected_user_id: meet.connectedUserId || null,
            name: meet.name,
            phone: meet.phone || null,
            instagram: meet.instagram || null,
            photo_url: meet.photo || null,
            about: meet.about || null,
            event: meet.event || null,
        })
        .select()
    if (error) {
        console.error('Error saving meet to Supabase:', error)
        return { success: false, error }
    }
    return { success: true, data }
}

// Fetch all meets for a user from Supabase
// Used when restoring on a new device
export async function getMeets(userId) {
    const { data, error } = await supabase
        .from('meets')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
    if (error) {
        console.error('Error fetching meets from Supabase:', error)
        return []
    }
    return data
}