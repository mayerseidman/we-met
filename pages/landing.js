import { useRouter } from 'next/router';
import { useStorage } from '../hooks/useStorage';
import { useEffect } from 'react';
import styles from '../styles/pages/Landing.module.scss';

export default function LandingPage() {
    const router = useRouter();
    const { profile } = useStorage();

    const handleGetStarted = () => {
        router.push('/profile');
    };

    const handleSignIn = () => {
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
                {/* 4 "hi!" bubbles matching reference positions */}
                <div className={`${styles.bubble} ${styles.bubble1}`}>Hi!</div>
                <div className={`${styles.bubble} ${styles.bubble2}`}>Howdy!</div>
                <div className={`${styles.bubble} ${styles.bubble3}`}>👋</div>
                
                {/* 2 floating hearts */}
                <div className={`${styles.floatingEmoji} ${styles.emoji1}`}>❤️</div>
                <div className={`${styles.floatingEmoji} ${styles.emoji2}`}>❤️</div>
            </div>       

            {/* Content */}
            <div className={styles.content}>
                {/* Logo circle */}
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