// ══════════════════════════════════════════════════════════════
// pages/landing.js
// ══════════════════════════════════════════════════════════════
// Landing page shown to brand new users with no local profile.
//
// WHY THIS EXISTS:
// First impression of the app — introduces We Met and gives
// users two paths: Get Started (new user) or Sign In (returning).
//
// ROUTING:
// - Only shown when user has no local profile and no session
// - Get Started → /profile to set up their profile
// - Sign In → /auth to log into existing account
//
// NOTE:
// _app.js handles routing to this page — it should never be
// shown to someone who already has a local profile.
// ══════════════════════════════════════════════════════════════

import { useRouter } from 'next/router';
import styles from '../styles/pages/Landing.module.scss';

export default function LandingPage() {
    const router = useRouter();

    // New user — go set up your profile
    const handleGetStarted = () => {
        router.push('/profile');
    };

    // Returning user with account — go sign in
    const handleSignIn = () => {
        router.push('/auth');
    };

    return (
        <div className={styles.landing}>
            <div className={styles.bubbles}>
                <div className={`${styles.bubble} ${styles.bubble1}`}>Hi!</div>
                <div className={`${styles.bubble} ${styles.bubble2}`}>Howdy!</div>
                <div className={`${styles.bubble} ${styles.bubble3}`}>👋</div>
                <div className={`${styles.floatingEmoji} ${styles.emoji1}`}>❤️</div>
                <div className={`${styles.floatingEmoji} ${styles.emoji2}`}>❤️</div>
            </div>

            <div className={styles.content}>
                <div className={styles.logoCircle}>👥</div>
                <h1 className={styles.title}>WE MET</h1>
                <p className={styles.tagline}>
                    Never lose a connection. Save everyone you meet at festivals and keep the magic alive!
                </p>
                <button className={styles.cta} onClick={handleGetStarted}>
                    GET STARTED
                </button>
                <div className={styles.auth}>
                    <span className={styles.authLabel}>Have an account?</span>
                    <button className={styles.authLink} onClick={handleSignIn}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}