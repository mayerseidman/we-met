// ══════════════════════════════════════════════════════════════
// hooks/useAuth.js
// ══════════════════════════════════════════════════════════════
// Custom React hook that tracks whether a user is logged in.
// Also handles syncing Supabase profile down to local storage on sign in.
//
// WHY THIS EXISTS:
// Components need to know if someone is logged in so they can
// decide what to show (e.g. "Save to account" vs "Create account").
// Rather than each component talking to Supabase directly,
// they all use this hook — one consistent source of truth.
//
// HOW TO USE:
// const { user, loading } = useAuth()
// - user is null when logged out, object when logged in
// - loading is true while we're checking auth state
//
// USED IN:
// - _app.js (top level, passed down as needed)
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getUserProfile } from '../lib/db'
import { storageManager } from '../lib/storage/StorageManager'

export function useAuth() {
    // user is null when logged out, or a user object when logged in
    const [user, setUser] = useState(null)

    // loading is true while we're checking if someone is logged in
    // prevents flashing "logged out" state before we know the truth
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if there's already an active session when the app loads
        // This handles the case where someone was logged in previously
        // and comes back to the app — they shouldn't have to log in again
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch(() => {
            setLoading(false)  // don't hang forever on error
        })

        // Failsafe — never stay loading forever
        const timeout = setTimeout(() => setLoading(false), 500)

        // Listen for auth state changes in real time
        // This fires whenever someone logs in or logs out
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const currentUser = session?.user ?? null
                setUser(currentUser)
                setLoading(false)

                // When a user signs in, pull their profile from Supabase
                // and save it to local storage so it's available offline
                if (_event === 'SIGNED_IN' && currentUser) {
                    try {
                        const cloudProfile = await getUserProfile(currentUser.id)
                        if (cloudProfile) {
                            // Map Supabase field names to local storage field names
                            // photo_url in Supabase → photo locally
                            const localProfile = {
                                name: cloudProfile.name || '',
                                phone: cloudProfile.phone || '',
                                instagram: cloudProfile.instagram || '',
                                location: cloudProfile.location || '',
                                about: cloudProfile.about || '',
                                photo: cloudProfile.photo_url || null,
                            }
                            await storageManager.init()
                            await storageManager.saveProfile(localProfile)
                            console.log('Profile synced from Supabase to local storage')
                        }
                    } catch (error) {
                        console.error('Failed to sync profile from Supabase:', error)
                        // Don't block — app works offline anyway
                    }
                }
            }
        )

        // Cleanup — stop listening when the component unmounts
        return () => {
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [])

    return { user, loading }
}