import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signUp, signIn, resetPassword } from '../lib/auth'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import styles from '../styles/pages/Auth.module.scss'

const POP = '/icons/pop'

export default function AuthPage() {
    const router = useRouter()
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()

    const [mode, setMode] = useState('signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [verificationSent, setVerificationSent] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.mode === 'signin' || router.query.mode === 'signup') {
            setMode(router.query.mode)
        }
    }, [router.isReady, router.query.mode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = mode === 'signup'
            ? await signUp(email, password)
            : await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (mode === 'signup') {
            showToast('Account created! 🎉')
            setVerificationSent(true)
            setLoading(false)
            return
        }

        showToast('👋 Welcome back! ')
        setTimeout(() => {
            const redirectTo = router.query.redirect || '/'
            router.push(redirectTo)
        }, 1500)
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await resetPassword(email)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        showToast('Reset link sent! Check your email 📬')
        setLoading(false)
        setForgotPassword(false)
        setMode('signin')
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>

                {/* App icon — shown on all states */}
                <div className={styles.iconTile}>
                    <img src={`${POP}/waving-hand.svg`} alt="" width={44} height={44} />
                </div>

                {verificationSent ? (
                    <>
                        <h1 className={styles.title}>Check your email! 📬</h1>
                        <p className={styles.subtitle}>
                            We sent a confirmation link to <strong>{email}</strong>.
                            Click it to activate your account.
                        </p>
                        <div className={styles.emailProviders}>
                            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className={styles.providerBtn}>
                                Open Gmail
                            </a>
                            <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer" className={styles.providerBtn}>
                                Open Outlook
                            </a>
                            <a href="https://mail.yahoo.com" target="_blank" rel="noopener noreferrer" className={styles.providerBtn}>
                                Open Yahoo
                            </a>
                            <a href="mailto:" className={styles.providerBtn}>
                                Open Mail App
                            </a>
                        </div>
                    </>
                ) : forgotPassword ? (
                    <>
                        <h1 className={styles.title}>Reset Password</h1>
                        <p className={styles.subtitle}>
                            Enter your email and we&apos;ll send you a reset link.
                        </p>
                        <form onSubmit={handleForgotPassword} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <p className={styles.toggle}>
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => {
                                    setForgotPassword(false)
                                    setError(null)
                                }}
                            >
                                Back to Sign In
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Password</label>
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
                            {error && (
                                <p className={styles.error}>{error}</p>
                            )}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading
                                    ? 'Loading...'
                                    : mode === 'signup' ? 'Create Account' : 'Sign In'}
                            </button>
                        </form>

                        {mode === 'signin' && (
                            <p className={styles.toggle}>
                                <button
                                    type="button"
                                    className={styles.toggleBtn}
                                    onClick={() => {
                                        setForgotPassword(true)
                                        setError(null)
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </p>
                        )}

                        <p className={styles.toggle}>
                            {mode === 'signup'
                                ? 'Already have an account? '
                                : 'No account yet? '}
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => {
                                    setMode(mode === 'signup' ? 'signin' : 'signup')
                                    setError(null)
                                }}
                            >
                                {mode === 'signup' ? 'Sign in' : 'Create account'}
                            </button>
                        </p>
                    </>
                )}

                <Toast
                    message={toastMessage}
                    visible={toastVisible}
                    onHide={hideToast}
                />
            </div>
        </div>
    )
}