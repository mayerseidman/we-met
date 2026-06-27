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
    const [verificationSent, setVerificationSent] = useState(true) // TEMP
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
           {!verificationSent && (
               <div className={styles.topBanner}>
                   {mode === 'signup' ? 'Join We Met' : 'Welcome back, sign in!'}
               </div>
           )}
            <div className={styles.content}>

                <div className={styles.brandRow}>
                    <div className={styles.iconTile}>
                        <img src={`${POP}/waving-hand.svg`} alt="" width={56} height={56} />
                    </div>
                    <h1 className={styles.brandName}>WE MET</h1>
                </div>

                {verificationSent ? (
                    <>
                        <p className={styles.subtitle}>
                            <strong>Email sent!</strong> A confirmation link is on the way to <strong>{email || 'your inbox'}.</strong>
                        </p>
                        <div className={styles.emailProviders}>
                            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className={styles.providerBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/></svg>
                                Gmail
                            </a>
                            <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer" className={styles.providerBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M7.462 0H0v7.19h7.462zM0 9.143v7.19h7.462v-7.19zm9.143 0v7.19H16.6v-7.19zm7.457 0v7.19H24v-7.19zM9.143 0v7.19H16.6V0zm7.457 0v7.19H24V0zm0 16.286V24H24v-7.714zm-7.457 0V24H16.6v-7.714zM0 16.286V24h7.462v-7.714zm9.143 0V24H16.6v-7.714z"/></svg>
                                Outlook
                            </a>
                            <a href="mailto:" className={styles.providerBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"/></svg>
                                Mail App
                            </a>
                        </div>
                        <p className={styles.toggle}>
                            <button type="button" className={styles.toggleBtn} onClick={() => { setVerificationSent(false); setMode('signin'); }}>
                                Back to sign in
                            </button>
                        </p>
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
                                Back to sign in
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