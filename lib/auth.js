// ══════════════════════════════════════════════════════════════
// lib/auth.js
// ══════════════════════════════════════════════════════════════
// All authentication functions live here.
//
// WHY THIS EXISTS:
// Keeping auth calls in one place means if we ever swap Supabase
// for something else, we only change this file — not every
// component that needs to log in or out.
//
// RULE: Never call supabase.auth directly from a component.
// Always import and use functions from this file instead.
//
// FUNCTIONS:
// - signUp(email, password) — create a new account
// - signIn(email, password) — log into existing account
// - signOut() — log out current user
// - getUser() — get current logged in user (or null)
// ══════════════════════════════════════════════════════════════

import { supabase } from './supabase'

// Create a new account with email and password
// Returns { data, error } — always check error before using data
export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })
    return { data, error }
}

// Log into an existing account
// Returns { data, error } — error will tell you if password is wrong etc
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

// Log out the current user
// Clears their session so they'll need to log in again
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

// Get the current logged-in user
// Returns null if nobody is logged in
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Send a password reset email
// User will get a link to /reset-password
export async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password'
    })
    return { data, error }
}