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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/pages/Landing.module.scss';

const POP = '/icons/pop';

const BUBBLE_TEXTS = [
    'Hi!', 'Howdy!', 'Ciao!', 'Hola!', 'Salut!', 'Aloha!', 'Namaste!', 'Hey!', 'Yo!', 'Wow!',
    'Sup!', 'Hej!', 'Olá!', 'Privet!', 'Hallo!', 'Yo yo!', 'Cheers!', 'Konnichiwa', 'Kia ora', 'Salam!',
];
const FLOAT_ICONS = ['heart', 'star', 'flash', 'heart', 'star'];

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export default function LandingPage() {
    const router = useRouter();

    const [bubbles, setBubbles] = useState(BUBBLE_TEXTS.slice(0, 10));
    const [icons, setIcons] = useState(['heart', 'heart', 'star', 'flash']);

    useEffect(() => {
        setBubbles(shuffle(BUBBLE_TEXTS).slice(0, 10));
        setIcons(Array.from({ length: 4 }, () => FLOAT_ICONS[Math.floor(Math.random() * FLOAT_ICONS.length)]));
    }, []);

    // New user — go set up your profile
    const handleGetStarted = () => {
        router.push('/profile?from=landing');
    };

    // Returning user with account — go sign in
    const handleSignIn = () => {
        router.push('/auth');
    };

    return (
        <div className={styles.landing}>
            <div className={styles.bubbles}>
                {bubbles.map((text, i) => (
                    <div key={i} className={`${styles.bubble} ${styles[`bubble${i + 1}`]}`}>{text}</div>
                ))}
                <img src={`${POP}/${icons[0]}.svg`} className={`${styles.floatingEmoji} ${styles.emoji1}`} alt="" width={40} height={40} />
                <img src={`${POP}/${icons[1]}.svg`} className={`${styles.floatingEmoji} ${styles.emoji2}`} alt="" width={40} height={40} />
                <img src={`${POP}/${icons[2]}.svg`} className={`${styles.floatingEmoji} ${styles.emoji3}`} alt="" width={40} height={40} />
                <img src={`${POP}/${icons[3]}.svg`} className={`${styles.floatingEmoji} ${styles.emoji4}`} alt="" width={40} height={40} />
            </div>

            <div className={styles.content}>
                <div className={styles.logoCircle}>
                    <img src={`${POP}/waving-hand-light.svg`} alt="" width={56} height={56} />
                </div>
                <h1 className={styles.title}>WE MET</h1>
                <p className={styles.tagline}>
                    Never lose a connection. Save everyone you meet at festivals and keep the magic alive!
                </p>
                <button className={styles.cta} onClick={handleGetStarted}>
                    Make my profile
                </button>

                <ul className={styles.perks} aria-label="What to expect">
                    <li>
                        <img src={`${POP}/flash.svg`} alt="" width={16} height={16} />
                        <span>30 seconds</span>
                    </li>
                    <li>
                        <img src={`${POP}/shield-check.svg`} alt="" width={16} height={16} />
                        <span>No app needed</span>
                    </li>
                    <li>
                        <img src={`${POP}/heart.svg`} alt="" width={16} height={16} />
                        <span>Free forever</span>
                    </li>
                </ul>

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