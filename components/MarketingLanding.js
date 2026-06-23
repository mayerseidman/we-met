// ══════════════════════════════════════════════════════════════
// components/MarketingLanding.js
// ══════════════════════════════════════════════════════════════
// Public-facing marketing page — first thing visitors see at `/`.
//
// SECTIONS:
// 1. Hero — headline, CTA buttons, floating bubbles
// 2. How it works — 3 steps stacked + animated phone
// 3. Why we built it — 4 feature cards
// 4. Final CTA — commented out, reserved for later use
// ══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/MarketingLanding.module.scss';

// ── Constants ─────────────────────────────────────────────────

const POP = '/icons/pop';

const BUBBLE_TEXTS = [
    'Hi!', 'Howdy!', 'Ciao!', 'Hola!', 'Salut!', 'Aloha!', 'Namaste!', 'Hey!', 'Yo!', 'Wow!',
    'Wassup!', 'Hej!', 'Olá!', 'Privet!', 'Hallo!', 'Yo yo!', 'Cheers!', 'Konnichiwa', 'Kia ora', 'Salam!',
];

const FLOAT_ICONS = ['heart', 'star', 'flash', 'heart', 'star'];

// Icons used as decorations in non-hero sections (no text bubbles below hero)
const SECTION_ICONS = ['heart', 'star', 'flash', 'star', 'heart'];

const STEPS = [
    {
        icon: 'users',
        title: 'Meet Someone',
        body: 'You connect with someone. Magic moment.',
    },
    {
        icon: 'qr-code',
        title: 'Scan Their QR',
        body: 'Tap, scan, done. No screenshots, no notes.',
    },
    {
        icon: 'heart',
        title: 'Stay Connected',
        body: 'Find them again next year. Or next weekend.',
    },
];

const FEATURES = [
    {
        icon: 'chat-bubble',
        title: 'Built For Festivals',
        body: 'Designed for the chaos of dance floors, campsites, and dust storms. No signal needed, ever.',
    },
    {
        icon: 'shield-check',
        title: 'No Spam, No Creeps',
        body: 'Only people you actually meet face to face. No follower counts, no cold DMs, no algorithm.',
    },
    {
        icon: 'browser-check',
        title: 'No App To Install',
        body: "Works in any browser, on any phone. Save it to your home screen and it's there forever.",
    },
    {
        icon: 'handshake',
        title: 'Find Them Again',
        body: 'Every connection is saved locally on your device. Find them at the next burn, the next campfire, the next anything.',
    },
];

const MINI_NAV_ITEMS = [
    { id: 'profile', icon: 'user-circle' },
    { id: 'connect', icon: 'qr-code' },
    { id: 'meets',   icon: 'users' },
];

// ── Helpers ───────────────────────────────────────────────────

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const pick = (arr, n) => shuffle(arr).slice(0, n);

// ── Custom Hooks ──────────────────────────────────────────────

const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.disconnect();
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px', ...options });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
};

// ── Sub-Components ────────────────────────────────────────────

const PopIcon = ({ name, size, alt = '' }) => (
    <img src={`${POP}/${name}.svg`} width={size} height={size} alt={alt} />
);

const MiniBottomNav = ({ active = 'meets', theme = 'light' }) => (
    <div className={`${styles.miniNav} ${theme === 'dark' ? styles.miniNavDark : ''}`}>
        {MINI_NAV_ITEMS.map(item => (
            <span
                key={item.id}
                className={`${styles.miniNavItem} ${active === item.id ? styles.miniNavActive : ''}`}
            >
                <img src={`${POP}/${item.icon}.svg`} alt="" width={20} height={20} />
            </span>
        ))}
    </div>
);

const PhoneShowQR = () => (
    <div className={`${styles.phoneScreen} ${styles.screenShow}`}>
        <div className={styles.screenH}>Show QR</div>
        <div className={styles.qrCard}>
            <div className={styles.qrCardImg}>
                <img src="/qr.png" alt="" />
                <span className={styles.qrCardAvatarOverlay}>A</span>
            </div>
        </div>
        <div className={styles.screenLabel}>Event</div>
        <div className={styles.eventSelect}>
            <span>Burning Man 2026</span>
            <svg className={styles.eventChevron} width="12" height="10" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
                <path d="M2 2 L14 2 L8 12 Z" />
            </svg>
        </div>
        <div className={styles.screenHint}>They don&apos;t have it? <u>What to Do</u></div>
        <MiniBottomNav active="connect" />
    </div>
);

const PhoneScan = () => (
    <div className={`${styles.phoneScreen} ${styles.screenScan}`}>
        <div className={styles.viewfinder}>
            <span className={`${styles.corner} ${styles.cornerTl}`} />
            <span className={`${styles.corner} ${styles.cornerTr}`} />
            <span className={`${styles.corner} ${styles.cornerBl}`} />
            <span className={`${styles.corner} ${styles.cornerBr}`} />
            <span className={styles.scanLine} />
        </div>
        <div className={styles.scanBottom}>
            <span className={styles.scanEvent}>Burning Man 2026</span>
            <span className={styles.scanHint}>What to Do</span>
        </div>
        <MiniBottomNav active="connect" />
    </div>
);

const PhoneMeets = () => (
    <div className={`${styles.phoneScreen} ${styles.screenDone}`}>
        <div className={styles.meetsHeader}>Meets</div>
        <div className={styles.meetsList}>
            <div className={`${styles.meetEntry} ${styles.meetEntryNew}`}>
                <div className={`${styles.meetAvatar} ${styles.meetAvatarOrange}`}>A</div>
                <div className={styles.meetMeta}>
                    <strong>Alex</strong>
                    <span>Today · Burning Man</span>
                </div>
                <span className={styles.newDot} />
            </div>
            <div className={styles.meetEntry}>
                <div className={`${styles.meetAvatar} ${styles.meetAvatarPurple}`}>S</div>
                <div className={styles.meetMeta}>
                    <strong>Sam</strong>
                    <span>Yesterday · Burning Man</span>
                </div>
            </div>
            <div className={styles.meetEntry}>
                <div className={`${styles.meetAvatar} ${styles.meetAvatarPink}`}>J</div>
                <div className={styles.meetMeta}>
                    <strong>Jamie</strong>
                    <span>2d ago · Burning Man</span>
                </div>
            </div>
        </div>
        <MiniBottomNav active="meets" />
    </div>
);

const PHONE_SCREENS = [PhoneShowQR, PhoneScan, PhoneMeets];

// Auto-advancing phone mockup cycling through all 3 screens
const AnimatedPhone = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % STEPS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const Screen = PHONE_SCREENS[activeStep];

    return (
        <div className={styles.animatedPhoneWrapper}>
            <div className={styles.phone}>
                <div className={styles.phoneFrame}>
                    <Screen />
                </div>
            </div>
        </div>
    );
};

// ── Section Components ────────────────────────────────────────

const HeroSection = ({ heroRef, bubbles, icons, waving, onIconClick, onGetStarted, onSignIn }) => (
    <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroDecor}>
            {bubbles.map((text, i) => (
                <div key={i} className={`${styles.bubble} ${styles[`bubble${i + 1}`]}`}>{text}</div>
            ))}
            <img src={`${POP}/${icons[0]}.svg`} className={`${styles.floatHeart} ${styles.heart1}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[1]}.svg`} className={`${styles.floatHeart} ${styles.heart2}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[2]}.svg`} className={`${styles.floatHeart} ${styles.heart3}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[3]}.svg`} className={`${styles.floatIcon} ${styles.cropTopRight}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[4]}.svg`} className={`${styles.floatIcon} ${styles.cropBottomLeft}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[5]}.svg`} className={`${styles.floatIcon} ${styles.starMid}`} alt="" width={40} height={40} />
        </div>

        <div className={styles.heroContent}>
            <button
                type="button"
                className={`${styles.appIcon} ${waving ? styles.appIconEager : ''}`}
                onClick={onIconClick}
                aria-label="We Met — say hi"
            >
                <PopIcon name="waving-hand-light" size={56} alt="" />
            </button>

            <span className={styles.kicker}>For festival people</span>
            <h1 className={styles.title}>
                Never lose<br />a connection.
            </h1>
            <p className={styles.tagline}>
                No signal? No problem. Save people you meet with a simple QR scan.
            </p>
            <div className={styles.ctaRow}>
                <button className={styles.ctaPrimary} onClick={onGetStarted}>
                    Get Started
                </button>
                <button className={styles.ctaGhost} onClick={onSignIn}>
                    Sign In
                </button>
            </div>
            <p className={styles.noAccountNote}>No account needed. Free forever.</p>
        </div>
    </section>
);



const HowItWorksSection = ({ sectionRef, inView }) => (
    <section ref={sectionRef} className={`${styles.section} ${styles.sectionFirst} ${inView ? styles.isVisible : ''}`}>
        {/* Symbol-only decorations — no text bubbles below hero */}
        <div className={styles.sectionDecor}>
            <img src={`${POP}/star.svg`} className={`${styles.floatIcon} ${styles.scatterStarA}`} alt="" width={36} height={36} />
            <img src={`${POP}/flash.svg`} className={`${styles.floatIcon} ${styles.cropLeftMid}`} alt="" width={36} height={36} />
        </div>

        <div className={styles.sectionHead}>
            <div className={styles.sectionLabelRow}>
                <span className={styles.sectionLabel}>How It Works</span>
            </div>
            <h2 className={styles.sectionTitle}>Three Taps.</h2>
        </div>

        <div className={styles.howItWorksLayout}>
            <ol className={styles.steps}>
                {STEPS.map((step, i) => (
                    <li key={step.title} className={styles.step}>
                        <div className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</div>
                        <div className={styles.stepIcon}>
                            <PopIcon name={step.icon} size={40} alt="" />
                        </div>
                        <div className={styles.stepText}>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepBody}>{step.body}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <AnimatedPhone />
        </div>
    </section>
);

const FeaturesSection = ({ sectionRef, inView }) => (
    <section ref={sectionRef} className={`${styles.section} ${inView ? styles.isVisible : ''}`}>
        {/* Symbol-only decorations */}
        <div className={styles.sectionDecor}>
            <img src={`${POP}/heart.svg`} className={`${styles.floatIcon} ${styles.scatterHeartB}`} alt="" width={36} height={36} />
            <img src={`${POP}/star.svg`} className={`${styles.floatIcon} ${styles.scatterStarB}`} alt="" width={36} height={36} />
        </div>

        <div className={styles.sectionHead}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelFeatures}`}>Why we built it</span>
            <h2 className={styles.sectionTitle}>Connections matter.</h2>
        </div>

        <div className={styles.features}>
            {FEATURES.map((feature) => (
                <div key={feature.title} className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <PopIcon name={feature.icon} size={36} alt="" />
                    </div>
                    <div className={styles.featureText}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureBody}>{feature.body}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

// ── Main Component ────────────────────────────────────────────

export default function MarketingLanding() {
    const router = useRouter();

    const [bubbles, setBubbles] = useState(BUBBLE_TEXTS.slice(0, 10));
    const [icons, setIcons] = useState(() => Array(6).fill('heart'));
    const [waving, setWaving] = useState(false);

    useEffect(() => {
        setBubbles(pick(BUBBLE_TEXTS, 10));
        setIcons(Array.from({ length: 6 }, () => FLOAT_ICONS[Math.floor(Math.random() * FLOAT_ICONS.length)]));

        const tag = 'background:#F5722F;color:#FFE066;padding:6px 12px;border-radius:6px;font-family:ui-monospace,monospace;font-weight:600;';
        const sub = 'color:#0C098C;font-family:ui-monospace,monospace;font-size:11px;';
        console.log('%c👋 Hey, festival people.', tag);
        console.log('%cBuilt for the kind of people who hug strangers and mean it.', sub);
    }, []);

    // Scroll parallax on hero decorations
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        const apply = () => {
            document.documentElement.style.setProperty('--scroll-y', String(window.scrollY));
            raf = 0;
        };
        const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(apply); };
        window.addEventListener('scroll', onScroll, { passive: true });
        apply();
        return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
    }, []);

    // Mouse parallax on hero
    const heroRef = useRef(null);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(hover: none)').matches) return;
        const hero = heroRef.current;
        if (!hero) return;

        let raf = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0;

        const tick = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            hero.style.setProperty('--mx', currentX.toFixed(4));
            hero.style.setProperty('--my', currentY.toFixed(4));
            const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
            raf = settled ? 0 : requestAnimationFrame(tick);
        };

        const onMove = (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
            if (!raf) raf = requestAnimationFrame(tick);
        };

        const onLeave = () => {
            targetX = 0; targetY = 0;
            if (!raf) raf = requestAnimationFrame(tick);
        };

        hero.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseleave', onLeave);
        return () => {
            hero.removeEventListener('mousemove', onMove);
            hero.removeEventListener('mouseleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const handleIconClick = () => {
        if (waving) return;
        setWaving(true);
        setTimeout(() => setWaving(false), 1200);
    };

    const handleGetStarted = () => router.push('/profile?from=landing');
    const handleSignIn = () => router.push('/auth');

    const [stepsRef, stepsInView] = useInView();
    const [featuresRef, featuresInView] = useInView();

    return (
        <main className={styles.page}>
            <HeroSection
                heroRef={heroRef}
                bubbles={bubbles}
                icons={icons}
                waving={waving}
                onIconClick={handleIconClick}
                onGetStarted={handleGetStarted}
                onSignIn={handleSignIn}
            />


            <HowItWorksSection sectionRef={stepsRef} inView={stepsInView} />

            <FeaturesSection sectionRef={featuresRef} inView={featuresInView} />

            {/* ── Final CTA ─────────────────────────────────────────
                Commented out — keeping for potential future use.
                Consider using on a dedicated /about or /press page.
            ─────────────────────────────────────────────────────── */}
            {/* <FinalCtaSection onGetStarted={handleGetStarted} /> */}
        </main>
    );
}