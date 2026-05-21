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
// const { user, loading, profileSynced } = useAuth()
// - user is null when logged out, object when logged in
// - loading is true while we're checking auth state
// - profileSynced is true once profile has been synced from Supabase
//
// USED IN:
// - _app.js (top level, passed down as needed)
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getUserProfile } from '../lib/db'
import { storageManager } from '../lib/storage/StorageManager'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // True once profile sync is complete (or not needed)
    const [profileSynced, setProfileSynced] = useState(false)

    useEffect(() => {
        // Check existing session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
            // If there's already a session, profile is already in local storage
            // from a previous sync — no need to sync again
            setProfileSynced(true)
        }).catch(() => {
            setLoading(false)
            setProfileSynced(true)
        })

        // Failsafe — never stay loading forever
        const timeout = setTimeout(() => {
            setLoading(false)
            setProfileSynced(true)
        }, 500)

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const currentUser = session?.user ?? null
                setUser(currentUser)
                setLoading(false)

                // When a user signs in fresh, pull profile from Supabase
                if (_event === 'SIGNED_IN' && currentUser) {
                    try {
                        const cloudProfile = await getUserProfile(currentUser.id)
                        if (cloudProfile) {
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
                    } finally {
                        // Always mark as synced so routing can proceed
                        setProfileSynced(true)
                    }
                } else {
                    // For any other event (SIGNED_OUT, TOKEN_REFRESHED etc)
                    setProfileSynced(true)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [])

    return { user, loading, profileSynced }
}