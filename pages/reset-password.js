import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import styles from '../styles/pages/Auth.module.scss'

const POP = '/icons/pop'

export default function ResetPasswordPage() {
    const router = useRouter()
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
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

    const BrandRow = () => (
        <div className={styles.brandRow}>
            <div className={styles.iconTile}>
                <img src={`${POP}/waving-hand.svg`} alt="" width={56} height={56} />
            </div>
            <h1 className={styles.brandName}>WE MET</h1>
        </div>
    )

    if (!ready) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <BrandRow />
                    <h2 className={styles.title}>One sec...</h2>
                    <p className={styles.subtitle}>We&apos;re dusting off your reset link</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <BrandRow />
                <h2 className={styles.title}>New Password</h2>
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