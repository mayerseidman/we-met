// ══════════════════════════════════════════════════════════════
// pages/reset-password.js
// ══════════════════════════════════════════════════════════════
// Page where users land after clicking the reset password link
// in their email. Supabase handles the token exchange via the
// URL hash — we just need to show a new password form.
//
// FLOW:
// User clicks reset link in email → lands here with token in URL
// → enters new password → success → redirect to /profile
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import styles from '../styles/pages/Auth.module.scss'

export default function ResetPasswordPage() {
    const router = useRouter()
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ready, setReady] = useState(false)

    // Wait for Supabase to process the token from the URL hash
    // Without this the session won't be set yet when the page loads
    useEffect(() => {
        // Fallback in case PASSWORD_RECOVERY event already fired before we subscribed
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setReady(true)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        showToast('Password updated! 🎉')
        setTimeout(() => {
            router.push('/profile')
        }, 1500)
    }

    if (!ready) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <img
                        src="/icons/pop/key.svg"
                        alt=""
                        width={64}
                        height={64}
                        className={styles.bareIcon}
                    />
                    <h1 className={styles.title}>One sec...</h1>
                    <p className={styles.subtitle}>
                        Dusting off your reset link. Won&apos;t take a minute.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.iconTile}>
                    <img src="/icons/pop/key.svg" alt="" width={48} height={48} />
                </div>
                <h1 className={styles.title}>New Password</h1>
                <p className={styles.subtitle}>
                    Choose a new password for your account.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="minimum 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder="same password again"
                            required
                            minLength={6}
                        />
                    </div>
                    {error && (
                        <p className={styles.error}>{error}</p>
                    )}
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <Toast
                    message={toastMessage}
                    visible={toastVisible}
                    onHide={hideToast}
                />
            </div>
        </div>
    )
}