import { useRouter } from 'next/router';
import { useStorage } from '../hooks/useStorage';
import { useEffect } from 'react';
import styles from '../styles/pages/Landing.module.scss';

export default function LandingPage() {
    const router = useRouter();
    const { profile } = useStorage();

    // // If user has a profile, redirect to /meets
    // useEffect(() => {
    //     if (profile) {
    //         router.push('/meets');
    //     }
    // }, [profile, router]);

    const handleGetStarted = () => {
        router.push('/profile');
    };

    const handleSignIn = () => {
        // Fake auth check - just check if profile exists
        if (profile) {
            router.push('/meets');
        } else {
            alert('No account found. Please create a profile first!');
        }
    };

    return (
        <div className={styles.landing}>
            {/* Floating bubbles */}
            <div className={styles.bubbles}>
                <div className={`${styles.bubble} ${styles.bubble1}`}>hi!</div>
                <div className={`${styles.bubble} ${styles.bubble2}`}>⭐</div>
                <div className={`${styles.bubble} ${styles.bubble3}`}>❤️</div>
                <div className={`${styles.bubble} ${styles.bubble4}`}>hi!</div>
                <div className={`${styles.bubble} ${styles.bubble5}`}>🎉</div>
                <div className={`${styles.bubble} ${styles.bubble6}`}>✨</div>
                <div className={`${styles.bubble} ${styles.bubble7}`}>👋</div>
                <div className={`${styles.bubble} ${styles.bubble8}`}>💫</div>
            </div>

            {/* Dark gradient overlay */}
            <div className={styles.overlay}></div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.logo}>👥</div>
                
                <h1 className={styles.title}>WE MET</h1>
                
                <p className={styles.tagline}>
                    Never lose a connection. Save everyone you meet at festivals and keep the magic alive!
                </p>

                <button className={styles.cta} onClick={handleGetStarted}>
                    GET STARTED →
                </button>

                <div className={styles.auth}>
                    <span className={styles.authLabel}>HAVE AN ACCOUNT?</span>
                    <button className={styles.authLink} onClick={handleSignIn}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}